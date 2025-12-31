"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
  ArrowRight,
  Mail
} from "lucide-react"
import { FaClock, FaFacebookF, FaLinkedinIn, FaPhoneAlt, FaTwitter, FaYoutube } from "react-icons/fa"
import { RiMapPin2Fill } from "react-icons/ri";
import { AiFillInstagram } from "react-icons/ai"
import { IoIosArrowRoundForward, IoLogoWhatsapp } from "react-icons/io"
import { MainSearchBar } from "@/components/blog/main-search-bar"
import { SocialShare } from "@/components/blog/social-share"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  title: string
  register: string
  specialty: string
  bio: string
  avatar: string
  coverImage: string
  email: string
  phone: string
  address: string
  workingHours: string
  specialties: string[]
  galleryImages: string[]
  services: Array<{
    id: string
    title: string
    description: string
  }>
  testimonials: Array<{
    id: string
    author: string
    content: string
    rating: number
  }>
  faqs: Array<{
    id: string
    question: string
    answer: string
  }>
  // Campos da seção "Dores do Cliente"
  painPointsTitle?: string
  painPointsSubtitle?: string
  painPointsImage?: string
  painPoints?: Array<{
    id: string
    title: string
    description: string
  }>
  // Campos da seção de Serviços
  servicesSectionTitle?: string
  servicesSectionSubtitle?: string
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    whatsapp?: string
  }
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  featured_image?: string
  published_at?: string
  category?: {
    name: string
    slug: string
  }
}

export default function ProfessionalPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [isLoading, setIsLoading] = useState(true)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const asideRef = useRef<HTMLElement | null>(null);
  const topMeasureRef = useRef<HTMLElement | null>(null); // elemento que mede a área acima do aside
  const [topOffset, setTopOffset] = useState<number>(16); // valor em px para top do sticky

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calc = () => {
      // distância do topo da viewport até o topo do elemento que medimos
      const measureEl = topMeasureRef.current;
      const asideEl = asideRef.current;
      if (!measureEl || !asideEl) return;

      // altura do conteúdo acima do aside (pode ser header, breadcrumb, etc)
      const rect = measureEl.getBoundingClientRect();
      const distanceFromViewportTopToMeasureBottom = rect.bottom; // px

      // queremos que o aside só "cole" depois desse espaço. 
      // Podemos adicionar um padding extra se quiser (ex: 16)
      const padding = 16;

      // Garantir um mínimo e máximo se desejar
      const computedTop = Math.max(8, distanceFromViewportTopToMeasureBottom + padding);

      // Mas top de sticky precisa ser em relação à viewport.
      // Se for muito grande (menu curto), limitar a, por exemplo, 120
      const maxTop = 200;
      setTopOffset(Math.min(computedTop, maxTop));
    };

    // recalcula em resize e em load
    calc();
    const onResize = () => calc();
    window.addEventListener("resize", onResize);

    // Observe mudanças no conteúdo (útil quando imagens carregam)
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => calc());
      if (topMeasureRef.current) ro.observe(topMeasureRef.current);
      if (document.body) ro.observe(document.body);
    } catch (e) {
      // ResizeObserver pode não existir em ambiente muito antigo — fallback ao resize/window
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) {
        try {
          if (topMeasureRef.current) ro.unobserve(topMeasureRef.current);
          ro.disconnect();
        } catch { }
      }
    };
  }, [professional]);

  // Fetch professional data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch professional data
        const professionalRes = await fetch(`${API_URL}/professionals/slug/${slug}`)
        if (professionalRes.ok) {
          const professionalData = await professionalRes.json()
          const prof = professionalData.professional

          // Map backend data to frontend format
          setProfessional({
            id: prof.id,
            name: prof.name,
            title: prof.title,
            register: prof.register || "",
            specialty: prof.specialty,
            bio: prof.bio,
            avatar: prof.avatar || "/placeholder.svg?height=300&width=300",
            coverImage: prof.cover_image || "/placeholder.svg?height=400&width=800",
            email: prof.email,
            phone: prof.phone,
            address: prof.address,
            workingHours: prof.working_hours || "Consulte horários disponíveis",
            specialties: prof.specialties || [],
            galleryImages: prof.gallery_images || [],
            services: prof.services || [],
            testimonials: prof.testimonials || [],
            faqs: prof.faqs || [],
            // Dores do Cliente
            painPointsTitle: prof.pain_points_title || "",
            painPointsSubtitle: prof.pain_points_subtitle || "",
            painPointsImage: prof.pain_points_image || "",
            painPoints: prof.pain_points || [],
            // Seção de Serviços
            servicesSectionTitle: prof.services_section_title || "",
            servicesSectionSubtitle: prof.services_section_subtitle || "",
            socialLinks: {
              facebook: prof.social_facebook,
              instagram: prof.social_instagram,
              linkedin: prof.social_linkedin,
              twitter: prof.social_twitter,
              whatsapp: prof.social_whatsapp,
            }
          })

          // Fetch posts do profissional
          const postsRes = await fetch(`${API_URL}/posts?per_page=6&professional=${prof.id}&published=true`)
          if (postsRes.ok) {
            const postsData = await postsRes.json()
            setPosts(postsData.posts || [])
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add form submission logic here
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-[#126861] rounded-full"></div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
          <Link href="/" className="text-[#126861] hover:underline">
            Voltar para home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Barra de busca / filtros (topo da página) */}
      <div className="hidden md:block ">
        <MainSearchBar />
      </div>

      {/* Conteúdo principal */}
      <div className=" py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto mb-10">
          {/* Coluna esquerda - conteúdo principal */}
          <div className="lg:col-span-2 space-y-10">
            {/* SOBRE - foto + texto, como no layout */}
            <section id="sobre" className="">
              <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
                <div className="border border-gray-200">
                  <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
                    <Image
                      src={professional.avatar}
                      alt={professional.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">{professional.name}</h3>
                    {professional.register && (
                      <p className="text-sm text-gray-600 font-semibold line-clamp-4 mb-1">{professional.register}</p>
                    )}
                    <p className="text-sm text-gray-700 line-clamp-4 mb-2 whitespace-pre-line">{professional.specialty}</p>
                    <p className="text-sm font-semibold text-gray-600 border-t border-gray-200 pt-2">@{professional.socialLinks.instagram?.split("/").pop()}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-[32px] text-neutral-700 font-normal font-sans uppercase mb-3">
                    Sobre
                  </h2>
                  <div className="text-base leading-relaxed text-gray-600 line-clamp-[19] whitespace-pre-line">
                    {professional.bio}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-[1px] w-full bg-gray-300 px-4" />
            <div className="flex flex-col items-center justify-center md:hidden">
              <p className="text-center text-gray-600 font-lato text-base mb-8 max-w-md mx-auto">Se você já conhece esse profissional/empresa, e quer entrar em contato com ele clique no botão abaixo para conhecer os dados de contato.</p>
              <Button className="bg-[#928575] hover:bg-[#928575]/80 text-white hover:text-white rounded-md flex items-center justify-center text-xs transition-colors">
                <Link href="#contato">
                  Entrar em contato
                </Link>
              </Button>
            </div>
            <div className="h-[1px] w-full bg-gray-300 px-4" />

            {/* Seção "VOCÊ ENFRENTA ALGUM DESTES PROBLEMAS?" */}
            {professional.painPoints && professional.painPoints.length > 0 && (
              <>
                <section className="bg-white overflow-hidden">
                  <h2 className="font-sans text-[32px]/10 font-normal text-neutral-700 uppercase mb-4">
                    {professional.painPointsTitle || "VOCÊ ENFRENTA ALGUM DESTES PROBLEMAS?"}
                  </h2>
                  {professional.painPointsSubtitle && (
                    <p className="font-sans text-base md:text-lg text-neutral-600 mb-6 leading-relaxed">
                      {professional.painPointsSubtitle}
                    </p>
                  )}

                  {/* Imagem da seção */}
                  {professional.painPointsImage && (
                    <div className="relative w-full h-48 md:h-64 mb-8">
                      <Image
                        src={professional.painPointsImage}
                        alt={professional.painPointsTitle || "Problemas"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Lista de dores/problemas */}
                  <div className="space-y-4">
                    {professional.painPoints.map((painPoint) => (
                      <div
                        key={painPoint.id}
                        className="flex-1 items-center gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#7a6b5a] flex items-center justify-center text-white font-semibold">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <h3 className="font-sans font-normal text-[28px] mb-1 text-neutral-700 line-clamp-1">{painPoint.title}</h3>
                        </div>
                        <p className="font-sans text-[17px] text-neutral-600 line-clamp-2">{painPoint.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}



            <div className="h-[1px] w-full bg-gray-300 px-4" />

            {/* O que os clientes dizem - Carousel */}
            <section id="depoimentos" className="bg-white">
              <h2 className="font-sans text-[32px]/10 line-clamp-2 font-normal text-neutral-700 uppercase text-center mb-8">
                O que os clientes dizem...
              </h2>

              {professional.testimonials && professional.testimonials.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <Carousel className="w-full pb-20 sm:pb-0" opts={{ loop: false }}>
                    <CarouselContent>
                      {professional.testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id}>
                          <div className="px-4 md:px-12 py-2 text-center pb-8 sm:pb-2">
                            <div className="flex justify-center">
                              {/* <span className="text-7xl md:text-8xl font-serif text-[#928575] leading-none h-fit">"</span> */}
                            </div>
                            <p className="text-base md:text-lg font-medium font-open-sans text-neutral-700 italic mb-2 leading-relaxed max-w-lg mx-auto">
                              {testimonial.content}
                            </p>
                            <div className="flex justify-center gap-1 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <div>
                              <p className="text-sm font-semibold font-open-sans text-neutral-700">
                                {testimonial.author}
                              </p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-bottom-2 left-1/3 -translate-x-12 sm:left-4 md:left-5 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 bg-[#928575] hover:bg-[#928575]/80 text-white hover:text-white rounded rotate-180" />
                    <CarouselNext className="-bottom-2 right-1/3 translate-x-12 sm:right-4 md:right-5 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 bg-[#928575] hover:bg-[#928575]/80 text-white hover:text-white rounded" />
                  </Carousel>
                </div>
              )}
              <div className="h-[1px] w-full bg-gray-300 mt-8" />
            </section>
            {/* Nossos Serviços - lista numerada */}
            <section id="servicos" className="">
              <div className="text-center mb-6">
                <div className="flex items-start justify-start">
                  <h2 className="font-sans text-[32px]/10 font-normal text-neutral-700 uppercase mb-4">
                    {professional.servicesSectionTitle || "Nossos serviços"}
                  </h2>
                </div>
                <p className="font-sans text-start text-base md:text-lg text-neutral-600">
                  {professional.servicesSectionSubtitle || "Veja a seguir os serviços que oferecemos e a descrição de cada um. <br /> Tendo alguma dúvida entre em contato para maiores informações."}
                </p>
              </div>
              {/* Imagem grande abaixo dos depoimentos */}
              {professional.galleryImages && professional.galleryImages.length > 1 && (
                <div className="bg-white shadow-sm">
                  <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <Image
                      src={professional.galleryImages[1] || professional.coverImage}
                      alt="Paciente em atendimento"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-4 mt-8">
                {professional.services.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex-1 items-center gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white font-normal mr-1">
                        <span className="text-4xl text-[#7a6b5a]">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="font-sans font-normal text-[28px] mb-1 text-neutral-700 line-clamp-1">{service.title}</h3>
                    </div>
                    <p className="font-sans text-[17px] text-neutral-600 line-clamp-2">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-[1px] w-full bg-gray-300 px-4"></div>
            {/* <p className="text-center text-[#DDDDDD] font-open-sans text-base mb-3 max-w-md mx-auto">OLÁ <span className="font-open-sans font-extrabold text-[#DDDDDD]">PORTAL</span></p> */}
            <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto -mt-2">
              <h2 className="font-sans text-[32px]/10 line-clamp-2 font-normal text-neutral-700 uppercase text-center mb-8">Artigos relacionados</h2>
              <Carousel className="w-full mb-8" opts={{ loop: false }}>
                <CarouselContent>
                  {posts.map((post) => (
                    <CarouselItem key={post.id} className="basis-5/6 md:basis-1/2 lg:basis-1/3 pb-32 sm:pb-24">
                      <Link href={post ? `/blog/${post.slug}` : "#"} className="relative bg-white group block">
                        <div className="relative w-full h-48 sm:h-56">
                          <Image
                            src={post?.featured_image || ""}
                            alt={post?.title || "Health"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {post && (
                          <div className="px-4 bg-white absolute top-[55%] sm:top-[45%] left-0 right-4 sm:right-8 py-4 shadow-md">
                            <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-[10px] border-none uppercase">
                              {post.category?.name || "CATEGORIA"}
                            </Badge>
                            <h3 className="font-open-sans font-semibold text-sm sm:text-base mb-1 text-gray-900 uppercase line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-xs sm:text-sm font-open-sans text-gray-600 mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                            <span className="font-lato text-[10px] italic text-gray-500 border border-gray-300 px-2 py-1 uppercase">
                              LEIA MAIS
                            </span>
                          </div>
                        )}
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-4 bg-white/80 hover:bg-white hidden sm:flex rotate-180" />
                <CarouselNext className="right-2 sm:right-4 bg-white/80 hover:bg-white hidden sm:flex" />
              </Carousel>
              {/* Dots de paginação */}
              <div className="flex justify-center mt-6 space-x-2">
                {posts.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </section>

            {/* Formulário de Contato */}
            {/* <section
              id="contato"
              className="pb-10 text-center"
            >
              <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto">
                <div className="flex items-center justify-center">
                  <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
                  <h2 className="font-sans text-[32px]/10 font-normal text-neutral-700 uppercase text-center text-nowrap mx-4 sm:mx-8 lg:mx-12 mb-2">
                    Entrar em contato
                  </h2>
                  <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
                </div>
                <p className="text-center text-gray-600 font-lato text-base mb-8 max-w-md mx-auto">
                  Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-start">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <Input
                        className="rounded-full shadow"
                        type="text"
                        placeholder="Digite seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="text-start">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <Input
                        className="rounded-full shadow"
                        type="tel"
                        placeholder="Digite seu telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-start">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        className="rounded-full shadow"
                        type="email"
                        placeholder="Deixe seu e-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-start">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      className="rounded-3xl shadow"
                      placeholder="Escreva sua mensagem aqui..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#126861] hover:bg-[#0f5650] text-white rounded-full px-4 py-3 text-base font-semibold flex items-center gap-2"
                  >
                    ENVIAR
                    <IoIosArrowRoundForward className="h-8 w-8 text-white" />
                  </Button>
                </form>
              </div>
            </section> */}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6 relative">
            {/* Card principal da barra lateral */}
            <aside className="bg-[#F6F4ED] border border-[#E2DED2] p-4 space-y-4 sticky -top-[300px] 2xl:-top-60">
              {/* Galeria: 1 imagem grande + 3 pequenas */}
              {professional.galleryImages && professional.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <div className="relative w-full aspect-[4/2] overflow-hidden">
                    <Image
                      src={professional.galleryImages[0] || "/placeholder.svg?height=220&width=320"}
                      alt="Consultório"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {professional.galleryImages.length > 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {professional.galleryImages.slice(1, 3).map((image, i) => (
                        <div
                          key={i}
                          className="relative h-32 overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Galeria ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Blocos de informação */}
              <div className="space-y-2 text-xs text-gray-700" id="contato">
                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <RiMapPin2Fill className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Endereço</span>
                  </div>
                  <p className="leading-snug whitespace-pre-line">{professional.address}</p>
                </div>

                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <FaClock className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Horários</span>
                  </div>
                  <p className="leading-snug whitespace-pre-line">{professional.workingHours}</p>
                </div>

                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <FaPhoneAlt className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Contatos</span>
                  </div>
                  {
                    (() => {
                      function parsePhones(text: string) {
                        const regex = /\(\d{2}\)\s?\d{4,5}-\d{4}/g;

                        // divide o texto em partes mantendo os números
                        const parts = text.split(regex);

                        // extrai os números para reinserir
                        const phones = text.match(regex) || [];

                        const result: string[] = [];

                        parts.forEach((part: string, index: number) => {
                          result.push(part); // adiciona o texto normal

                          if (phones[index]) {
                            const raw = phones[index].replace(/[^\d]/g, ""); // remove formatação
                            result.push(
                              <a
                                key={index}
                                href={`tel:${raw}`}
                                className="text-blue-500 underline"
                              >
                                {phones[index]}
                              </a>
                            );
                          }
                        });

                        return result
                      }

                      return (
                        <div>
                          <p className="leading-snug whitespace-pre-line text-sm no-underline text-neutral-700">
                            {parsePhones(professional.phone)}
                          </p>
                        </div>
                      );
                    })()
                  }
                  {/* <p className="leading-snug whitespace-pre-line">{professional.phone}</p> */}
                  {professional.socialLinks.whatsapp && (
                    <div className="flex items-center gap-2 text-base">
                      WhatsApp:
                      <a
                        href={professional.socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h- text-[#928575] flex items-center justify-center text-xs transition-colors"
                      >
                        <IoLogoWhatsapp className="w-5 h-5" />
                      </a>
                      {professional.socialLinks.whatsapp}
                    </div>
                  )}
                </div>
              </div>

              {/* Redes sociais */}
              <div className="pt-2">
                <p className="text-lg font-semibold text-gray-800 mb-1">Redes Sociais</p>
                <div className="grid grid-cols-2 gap-1">
                  {professional.socialLinks.facebook && (
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={professional.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                      >
                        <FaFacebookF className="w-5 h-5" />
                      </a>
                      Facebook
                    </div>
                  )}
                  {professional.socialLinks.twitter && (
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={professional.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                      Twitter
                    </div>
                  )}
                  {professional.socialLinks.instagram && (
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={professional.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                      >
                        <AiFillInstagram className="w-5 h-5" />
                      </a>
                      <div>
                        Instagram
                      </div>
                    </div>
                  )}
                  {professional.socialLinks.linkedin && (
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={professional.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                      >
                        <FaLinkedinIn className="w-5 h-5" />
                      </a>
                      LinkedIn
                    </div>
                  )}

                  {professional.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={`mailto:${professional.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      E-mail
                    </div>
                  )}

                </div>
              </div>
              {/* LOCALIZAÇÃO - mapa abaixo da barra lateral */}
              <section className="bg-white shadow-sm p-4">
                <h3 className="text-base font-semibold tracking-[0.25em] uppercase mb-3">
                  Localização
                </h3>
                <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(professional.address?.split('\n')[0] || professional.address)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>

        {/* Perguntas Frequentes */}
        <div className="h-[1px] w-full bg-gray-300 px-4 mx-auto max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl"></div>

        <section id="faq" className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto mt-8">
          <h2 className="font-sans text-[32px]/10 line-clamp-2 font-normal text-neutral-700 uppercase text-center mb-2">Perguntas Frequentes</h2>
          <p className="font-sans text-base md:text-lg text-center text-neutral-600 max-w-md mx-auto">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
          </p>

          <div className="space-y-4 max-w-7xl mx-auto mt-6">
            {professional.faqs.map((faq, index) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between p-4 text-left ${openFaqIndex === index ? 'bg-[#F3F0E8]' : ''} hover:bg-[#F3F0E8] transition-colors`}
                >
                  <span className=" text-neutral-700">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="p-4 pt-0 text-gray-600 bg-[#F3F0E8]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Compartilhe */}
        <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto px-4 mb-8">
          <SocialShare title={professional.name} />
        </div>
      </div>
    </div>
  )
}


"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
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
  ArrowRight
} from "lucide-react"
import { FaClock, FaFacebookF, FaLinkedinIn, FaPhoneAlt, FaTwitter, FaYoutube } from "react-icons/fa"
import { RiMapPin2Fill } from "react-icons/ri";
import { AiFillInstagram } from "react-icons/ai"
import { IoIosArrowRoundForward, IoLogoWhatsapp } from "react-icons/io"
import { MainSearchBar } from "@/components/blog/main-search-bar"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  title: string
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
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
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
            socialLinks: {
              facebook: prof.social_facebook,
              instagram: prof.social_instagram,
              linkedin: prof.social_linkedin,
              twitter: prof.social_twitter,
            }
          })
        }

        // Fetch recent blog posts
        const postsRes = await fetch(`${API_URL}/posts?per_page=3`)
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          setPosts(postsData.posts || [])
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
    <div className="flex flex-col bg-white pt-24">
      {/* Barra de busca / filtros (topo da página) */}
      <MainSearchBar />

      {/* Conteúdo principal */}
      <div className="w-full py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {/* Coluna esquerda - conteúdo principal */}
          <div className="lg:col-span-2 space-y-10">
            {/* SOBRE - foto + texto, como no layout */}
            <section id="sobre" className="mb-10">
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
                    <h3 className="text-lg font-bold text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.specialty}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-semibold uppercase mb-3">
                    Sobre
                  </h2>
                  <div className="space-y-3 text-base leading-relaxed text-gray-700">
                    {professional.bio.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Seção de Serviços com imagem e lista */}
            <section className="bg-white overflow-hidden">
              {/* Imagem do consultório */}
              {professional.coverImage && (
                <div className="relative w-full h-48 md:h-64">
                  <Image
                    src={professional.coverImage}
                    alt={professional.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Conteúdo */}
              <div className="pt-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 uppercase mb-4">
                  {professional.specialty || "LOREM IPSUM DOLOR SIT AMET SEE CONSECTETUR ADIPINSIG"}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed ">
                  {professional.bio.split('\n')[0] || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"}
                </p>

                {/* Lista de serviços numerada */}
                <div className="space-y-3">
                  {professional.services.slice(0, 6).map((service, index) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#126861] flex items-center justify-center text-white font-semibold">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* O que os clientes dizem - Carousel */}
            <section id="depoimentos" className="bg-white py-12 px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-center uppercase mb-8 text-gray-900">
                O que os clientes dizem...
              </h2>

              {professional.testimonials && professional.testimonials.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <Carousel className="w-full" opts={{ loop: false }}>
                    <CarouselContent>
                      {professional.testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id}>
                          <div className="px-4 md:px-12 py-4 text-center">
                            <div className="flex justify-center">
                              <span className="text-7xl md:text-8xl font-serif text-[#928575] leading-none">"</span>
                            </div>
                            <p className="text-base md:text-lg text-gray-700 italic mb-6 leading-relaxed max-w-2xl mx-auto">
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
                            <p className="text-sm font-semibold text-gray-900">
                              {testimonial.author}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-[#928575] hover:bg-[#928575]/80 text-white hover:text[#928575] rounded" />
                    <CarouselNext className="bg-[#928575] hover:bg-[#928575]/80 text-white hover:text[#928575] rounded" />
                  </Carousel>
                </div>
              )}
            </section>

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

            {/* Nossos Serviços - lista numerada */}
            <section id="servicos" className="">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center">
                  <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
                  <h2 className="text-3xl font-semibold tracking-[0.05em] uppercase mb-2 text-nowrap mx-4 sm:mx-8 lg:mx-12">
                    Nossos serviços
                  </h2>
                  <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
                </div>
                <p className="text-base text-gray-600 max-w-md mx-auto">
                  Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
                </p>
              </div>
              <div className="space-y-4">
                {professional.services.map((service, index) => (
                  <div key={service.id} className="flex gap-4">
                    <span className="text-3xl font-semibold text-[#928575] min-w-[2rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 uppercase mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-[1px] w-full bg-gray-300 px-4"></div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card principal da barra lateral */}
            <aside className="bg-[#F6F4ED] border border-[#E2DED2] p-4 space-y-4">
              {/* Galeria: 1 imagem grande + 3 pequenas */}
              {professional.galleryImages && professional.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
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
                          className="relative h-20 overflow-hidden"
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
              <div className="space-y-2 text-xs text-gray-700">
                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <RiMapPin2Fill className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Endereço</span>
                  </div>
                  <p className="leading-snug">{professional.address}</p>
                </div>

                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <FaClock className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Horários</span>
                  </div>
                  <p className="leading-snug">{professional.workingHours}</p>
                </div>

                <div className="bg-white border border-[#E2DED2] px-3 py-3">
                  <div className="flex items-center text-base gap-2 mb-1 font-semibold">
                    <FaPhoneAlt className="h-4 w-4 rounded-full text-[#126861]" />
                    <span>Contatos</span>
                  </div>
                  <p className="leading-snug">{professional.phone}</p>
                  <p className="leading-snug break-all">{professional.email}</p>
                </div>
              </div>

              {/* Redes sociais */}
              <div className="pt-2">
                <p className="text-lg font-semibold text-gray-800 mb-1">Redes Sociais</p>
                <div className="flex flex-wrap gap-2">
                  {professional.socialLinks.facebook && (
                    <a
                      href={professional.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                    >
                      <FaFacebookF className="w-5 h-5" />
                    </a>
                  )}
                  {professional.socialLinks.twitter && (
                    <a
                      href={professional.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  )}
                  {professional.socialLinks.instagram && (
                    <a
                      href={professional.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                    >
                      <AiFillInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {professional.socialLinks.linkedin && (
                    <a
                      href={professional.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs transition-colors"
                    >
                      <FaLinkedinIn className="w-5 h-5" />
                    </a>
                  )}
                  <div className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs">
                    <FaYoutube className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 bg-white hover:bg-[#928575]/80 text-[#928575] hover:text-white rounded-md flex items-center justify-center text-xs">
                    <IoLogoWhatsapp className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </aside>

            {/* LOCALIZAÇÃO - mapa abaixo da barra lateral */}
            <section className="bg-white shadow-sm p-4">
              <h3 className="text-base font-semibold tracking-[0.25em] uppercase mb-3">
                Localização
              </h3>
              <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(professional.address)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Formulário de Contato */}
        <section
          id="contato"
          className="bg-[#F6F4ED] border border-[#E2DED2] py-10 text-center"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
              <h2 className="text-7xl font-bold text-center text-gray-900 mb-2 text-nowrap mx-4 sm:mx-8 lg:mx-12">Entrar em Contato</h2>
              <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
            </div>
            <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
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
        </section>

        {/* Perguntas Frequentes */}
        <section id="faq" className="py-20">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-2">Perguntas Frequentes</h2>
          <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
          </p>

          <div className="space-y-4 max-w-7xl mx-auto">
            {professional.faqs.map((faq, index) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between p-4 text-left ${openFaqIndex === index ? 'bg-[#F3F0E8]' : ''} hover:bg-[#F3F0E8] transition-colors`}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
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

        {/* Últimas Dicas e Notícias */}
        {posts.length > 0 && (
          <section className="mt-16 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Últimas Dicas e Notícias</h2>
            <p className="text-center text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consecteur adipiscing elit
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] text-white mb-2 text-xs">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                    >
                      LEIA MAIS
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


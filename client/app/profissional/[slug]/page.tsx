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
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react"

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

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Mock professional data
        setProfessional({
          id: "1",
          name: "Clara Sousa",
          title: "Dentista",
          specialty: "Odontologia Estética",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          avatar: "/placeholder.svg?height=300&width=300",
          coverImage: "/placeholder.svg?height=400&width=800",
          email: "clara.sousa@exemplo.com",
          phone: "(11) 98765-4321",
          address: "Rua Exemplo, 123 - Centro, São Paulo - SP",
          workingHours: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
          specialties: ["Implantes", "Ortodontia", "Clareamento", "Próteses"],
          services: [
            {
              id: "1",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "2",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "3",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "4",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "5",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "6",
              title: "Lorem ipsum dolor sit amet at consectetur see you me",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          ],
          testimonials: [
            {
              id: "1",
              author: "João Silva",
              content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam elit.",
              rating: 5
            }
          ],
          faqs: [
            {
              id: "1",
              question: "Lorem ipsum dolor sit amet consectetur adipiscing?",
              answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
              id: "2",
              question: "Ut enim ad minim veniam elit at dolor?",
              answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "3",
              question: "Lorem ipsum sit amet consectetur adipiscing?",
              answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
              id: "4",
              question: "Ut enim ad minim veniam elit ac dignissim?",
              answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          ],
          socialLinks: {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
          }
        })

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

    fetchData()
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
    <div className="flex flex-col bg-white pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] bg-gray-200">
        <Image
          src={professional.coverImage}
          alt={professional.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Sobre Section */}
            <section id="sobre">
              <h2 className="text-3xl font-bold text-[#126861] mb-6">SOBRE</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={professional.avatar}
                      alt={professional.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{professional.name}</h3>
                  <p className="text-[#126861] font-medium">{professional.title}</p>
                </div>
                <div className="md:col-span-2">
                  <div className="prose max-w-none">
                    {professional.bio.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Services Image */}
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Consultório"
                fill
                className="object-cover"
              />
            </div>

            {/* Nossos Serviços */}
            <section id="servicos">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">NOSSOS SERVIÇOS</h2>
              <p className="text-center text-gray-600 mb-8">Lorem ipsum dolor sit amet, consecteur adipiscing elit</p>
              
              <div className="space-y-6">
                {professional.services.map((service, index) => (
                  <div key={service.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#126861] text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* O que os clientes dizem */}
            <section id="depoimentos" className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">O QUE OS CLIENTES DIZEM...</h2>
              
              {professional.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="mt-6">
                  <div className="flex justify-center mb-4">
                    <span className="text-4xl text-gray-400">"</span>
                  </div>
                  <p className="text-center text-gray-700 italic mb-4">
                    {testimonial.content}
                  </p>
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Formulário de Contato */}
            <section id="contato" className="bg-white p-8 border border-gray-200 rounded-lg">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Entrar em Contato</h2>
              <p className="text-center text-gray-600 mb-8">
                Ut enim ad minim veniam, quis nostrud exercitation
              </p>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <Input
                    type="text"
                    placeholder="Lorem ipsum dolor sit amet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Lorem ipsum dolor sit amet"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      placeholder="Lorem ipsum dolor sit amet"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    placeholder="Lorem ipsum dolor sit amet"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="bg-[#126861] hover:bg-[#0f5650] text-white px-8 py-3"
                >
                  ENVIAR
                </Button>
              </form>
            </section>

            {/* Perguntas Frequentes */}
            <section id="faq">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Perguntas Frequentes</h2>
              <p className="text-center text-gray-600 mb-8">
                Lorem ipsum dolor sit amet, consecteur adipiscing elit
              </p>
              
              <div className="space-y-4">
                {professional.faqs.map((faq, index) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaqIndex === index && (
                      <div className="p-4 pt-0 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Galeria 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Galeria 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Galeria 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Galeria 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">ENDEREÇO</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#126861] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm">{professional.address}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#126861] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm">{professional.phone}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#126861] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm">{professional.email}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#126861] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm">{professional.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-4">ESPECIALIDADES</h3>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    className="bg-[#126861] hover:bg-[#0f5650] text-white"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-4">LOCALIZAÇÕES</h3>
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Mapa"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-4">REDES SOCIAIS</h3>
              <div className="flex gap-4">
                {professional.socialLinks.facebook && (
                  <a
                    href={professional.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {professional.socialLinks.instagram && (
                  <a
                    href={professional.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {professional.socialLinks.linkedin && (
                  <a
                    href={professional.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {professional.socialLinks.twitter && (
                  <a
                    href={professional.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Últimas Dicas e Notícias */}
        {posts.length > 0 && (
          <section className="mt-16">
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


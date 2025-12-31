"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Plus, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import { FaClock, FaPhoneAlt } from "react-icons/fa"
import { RiMapPin2Fill } from "react-icons/ri"

interface Service {
  id: string
  title: string
  description: string
}

interface Testimonial {
  id: string
  author: string
  content: string
  rating: number
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface PainPoint {
  id: string
  title: string
  description: string
}

interface AdditionalCity {
  id: string
  city: string
  state: string
}

export default function EditProfessionalPage() {
  const router = useRouter()
  const params = useParams()
  const professionalId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    register: "",
    slug: "",
    title: "",
    specialty: "",
    bio: "",
    avatar: "",
    cover_image: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    working_hours: "",
    social_facebook: "",
    social_instagram: "",
    social_linkedin: "",
    social_twitter: "",
    social_youtube: "",
    social_whatsapp: "",
    active: true,
    featured: false,
  })

  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  // Estados para a seção "Dores do Cliente"
  const [painPointsTitle, setPainPointsTitle] = useState("")
  const [painPointsSubtitle, setPainPointsSubtitle] = useState("")
  const [painPointsImage, setPainPointsImage] = useState("")
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])

  // Estados para a seção de Serviços
  const [servicesSectionTitle, setServicesSectionTitle] = useState("")
  const [servicesSectionSubtitle, setServicesSectionSubtitle] = useState("")

  // Estados para cidades adicionais de atuação
  const [additionalCities, setAdditionalCities] = useState<AdditionalCity[]>([])

  useEffect(() => {
    const fetchProfessional = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals/id/${professionalId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const prof = data.professional

          setFormData({
            name: prof.name || "",
            slug: prof.slug || "",
            register: prof.register || "",
            title: prof.title || "",
            specialty: prof.specialty || "",
            bio: prof.bio || "",
            avatar: prof.avatar || "",
            cover_image: prof.cover_image || "",
            email: prof.email || "",
            phone: prof.phone || "",
            address: prof.address || "",
            city: prof.city || "",
            state: prof.state || "",
            working_hours: prof.working_hours || "",
            social_facebook: prof.social_facebook || "",
            social_instagram: prof.social_instagram || "",
            social_linkedin: prof.social_linkedin || "",
            social_twitter: prof.social_twitter || "",
            social_youtube: prof.social_youtube || "",
            social_whatsapp: prof.social_whatsapp || "",
            active: prof.active ?? true,
            featured: prof.featured ?? false,
          })

          setSpecialties(prof.specialties || [])
          setServices(prof.services || [])
          setTestimonials(prof.testimonials || [])
          setFaqs(prof.faqs || [])
          setGalleryImages(prof.gallery_images || [])

          // Carregar dados de "Dores do Cliente"
          setPainPointsTitle(prof.pain_points_title || "")
          setPainPointsSubtitle(prof.pain_points_subtitle || "")
          setPainPointsImage(prof.pain_points_image || "")
          setPainPoints(prof.pain_points || [])

          // Carregar dados da seção de Serviços
          setServicesSectionTitle(prof.services_section_title || "")
          setServicesSectionSubtitle(prof.services_section_subtitle || "")

          // Carregar cidades adicionais de atuação
          setAdditionalCities(prof.additional_cities || [])
        } else {
          setError("Profissional não encontrado")
        }
      } catch (error) {
        console.error("Error fetching professional:", error)
        setError("Erro ao carregar profissional")
      } finally {
        setIsLoading(false)
      }
    }

    if (professionalId) {
      fetchProfessional()
    }
  }, [professionalId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setFormData((prev) => ({ ...prev, slug }))
  }

  // Especialidades
  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties((prev) => [...prev, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index))
  }

  // Serviços
  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", description: "" },
    ])
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    )
  }

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id))
  }

  // Depoimentos
  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      { id: Date.now().toString(), author: "", content: "", rating: 5 },
    ])
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      )
    )
  }

  const removeTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((testimonial) => testimonial.id !== id))
  }

  // FAQs
  const addFAQ = () => {
    setFaqs((prev) => [
      ...prev,
      { id: Date.now().toString(), question: "", answer: "" },
    ])
  }

  const updateFAQ = (id: string, field: keyof FAQ, value: string) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    )
  }

  const removeFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id))
  }

  // Galeria
  const addGalleryImage = (url: string) => {
    if (url.trim()) {
      setGalleryImages((prev) => [...prev, url.trim()])
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Dores do Cliente (Pain Points)
  const addPainPoint = () => {
    setPainPoints((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", description: "" },
    ])
  }

  const updatePainPoint = (id: string, field: keyof PainPoint, value: string) => {
    setPainPoints((prev) =>
      prev.map((painPoint) =>
        painPoint.id === id ? { ...painPoint, [field]: value } : painPoint
      )
    )
  }

  const removePainPoint = (id: string) => {
    setPainPoints((prev) => prev.filter((painPoint) => painPoint.id !== id))
  }

  // Cidades Adicionais de Atuação
  const addAdditionalCity = () => {
    setAdditionalCities((prev) => [
      ...prev,
      { id: Date.now().toString(), city: "", state: "" },
    ])
  }

  const updateAdditionalCity = (id: string, field: keyof AdditionalCity, value: string) => {
    setAdditionalCities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeAdditionalCity = (id: string) => {
    setAdditionalCities((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const payload = {
        ...formData,
        specialties,
        services,
        testimonials,
        faqs,
        gallery_images: galleryImages,
        additional_cities: additionalCities,
        pain_points_title: painPointsTitle,
        pain_points_subtitle: painPointsSubtitle,
        pain_points_image: painPointsImage,
        pain_points: painPoints,
        services_section_title: servicesSectionTitle,
        services_section_subtitle: servicesSectionSubtitle,
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals/${professionalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        router.push("/admin/professionals")
      } else {
        const data = await response.json()
        setError(data.message || "Erro ao atualizar profissional")
      }
    } catch (error) {
      console.error("Error updating professional:", error)
      setError("Erro ao atualizar profissional. Por favor, tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#126861]" />
            <p className="text-gray-500">Carregando profissional...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col bg-white">
        {/* Header com botões de ação */}
        <div className="bg-[#F6F4ED] border-b border-[#E2DED2] px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Profissional</h1>
              <p className="text-sm text-gray-600 mt-1">{formData.name || "Carregando..."}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/professionals")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="professional-form"
                className="bg-[#126861] hover:bg-[#0f5650]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Atualizar Profissional
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto w-full px-6 pt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <form id="professional-form" onSubmit={handleSubmit} className="w-full py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {/* Coluna Principal - 2/3 */}
            <div className="lg:col-span-2 space-y-10">
              {/* SOBRE - Seção Principal */}
              <section id="sobre">
                <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
                  {/* Card com Avatar */}
                  <div className="border border-gray-200">
                    <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                      {formData.avatar ? (
                        <Image
                          src={formData.avatar}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-sm">Avatar</span>
                        </div>
                      )}
                    </div>
                    <div className="px-4 pb-4 space-y-2">
                      <Input
                        placeholder="Nome Completo *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="font-bold"
                      />
                      <Textarea
                        placeholder="Registro (Opcional)"
                        name="register"
                        value={formData.register}
                        onChange={handleInputChange}
                        rows={2}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Especialidade *"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                      <Input
                        placeholder="URL do Avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Conteúdo Sobre */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-4xl font-semibold uppercase mb-3 text-gray-900">
                        Sobre
                      </h2>
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Slug (URL) *"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                        />
                        <Button type="button" onClick={generateSlug} variant="outline">
                          Gerar
                        </Button>
                      </div>
                      <Input
                        placeholder="Título/Profissão *"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mb-3"
                      />
                    </div>
                    <Textarea
                      placeholder="Biografia... *"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={19}
                      required
                      className="text-base leading-relaxed"
                    />
                  </div>
                </div>
              </section>

              {/* Seção "Dores do Cliente" (VOCÊ ENFRENTA ALGUM DESTES PROBLEMAS?) */}
              <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 uppercase mb-4">
                  Seção Dores
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Configure a seção "VOCÊ ENFRENTA ALGUM DESTES PROBLEMAS?" que aparece na página do profissional
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Título
                    </Label>
                    <Input
                      placeholder="Ex: VOCÊ ENFRENTA ALGUM DESTES PROBLEMAS?"
                      value={painPointsTitle}
                      onChange={(e) => setPainPointsTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Subtítulo/Descrição
                    </Label>
                    <Textarea
                      placeholder="Ex: A seguir apresentamos alguns dos principais problemas que as pessoas nos relatam quando nos procuram..."
                      value={painPointsSubtitle}
                      onChange={(e) => setPainPointsSubtitle(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Imagem da Seção
                    </Label>
                    <div className="relative w-full h-32 bg-gray-100 mb-2 rounded overflow-hidden">
                      {painPointsImage ? (
                        <Image
                          src={painPointsImage}
                          alt="Imagem das dores"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-sm">Imagem da seção de problemas</span>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="URL da imagem"
                      value={painPointsImage}
                      onChange={(e) => setPainPointsImage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {painPoints.map((painPoint) => (
                    <div key={painPoint.id} className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#7a6b5a] flex items-center justify-center text-white">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Título do problema (ex: Implantes Dentários)"
                            value={painPoint.title}
                            onChange={(e) => updatePainPoint(painPoint.id, "title", e.target.value)}
                            className="font-semibold"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePainPoint(painPoint.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Descrição do problema..."
                          value={painPoint.description}
                          onChange={(e) => updatePainPoint(painPoint.id, "description", e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={addPainPoint} variant="outline" className="w-full">
                  <Plus size={16} className="mr-2" />
                  Adicionar Problema/Dor
                </Button>
              </section>

              {/* Depoimentos */}
              <section className="bg-white py-12 px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-center uppercase mb-8 text-gray-900">
                  O que os clientes dizem...
                </h2>

                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <Input
                          placeholder="Nome do cliente"
                          value={testimonial.author}
                          onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value)}
                          className="font-semibold"
                        />
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="⭐ (1-5)"
                          value={testimonial.rating}
                          onChange={(e) => updateTestimonial(testimonial.id, "rating", Number(e.target.value))}
                          className="w-24"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestimonial(testimonial.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Depoimento..."
                        value={testimonial.content}
                        onChange={(e) => updateTestimonial(testimonial.id, "content", e.target.value)}
                        rows={3}
                        className="italic"
                      />
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={addTestimonial} variant="outline" className="w-full mt-4">
                  <Plus size={16} className="mr-2" />
                  Adicionar Depoimento
                </Button>
              </section>

              {/* Seção com Imagem de Capa e Serviços */}
              <section className="bg-white overflow-hidden">
                {/* Título e Subtítulo da Seção de Serviços */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Título</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure o título e subtítulo que aparecem na seção de serviços
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Título
                      </Label>
                      <Input
                        placeholder="Ex: TRATAMENTOS ODONTOLÓGICOS ESPECIALIZADOS"
                        value={servicesSectionTitle}
                        onChange={(e) => setServicesSectionTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Subtítulo
                      </Label>
                      <Textarea
                        placeholder="Ex: Oferecemos tratamentos de alta qualidade com tecnologia de ponta..."
                        value={servicesSectionSubtitle}
                        onChange={(e) => setServicesSectionSubtitle(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="relative w-full h-48 md:h-64 bg-gray-100 mb-6">
                      {formData.cover_image ? (
                        <Image
                          src={formData.cover_image}
                          alt="Capa"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>Imagem de Capa</span>
                        </div>
                      )}
                    </div>

                    <Input
                      placeholder="URL da Imagem de Capa"
                      name="cover_image"
                      value={formData.cover_image}
                      onChange={handleInputChange}
                      className="mb-6"
                    />
                  </div>
                  {/* Lista de serviços */}
                  <div className="space-y-3 mb-4">
                    {services.map((service, index) => (
                      <div key={service.id} className="flex items-start gap-4 border border-gray-200 rounded-lg p-4">
                        <span className="text-4xl sm:text-5xl font-open-sans font-medium text-[#928575] min-w-[3rem]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Título do serviço"
                              value={service.title}
                              onChange={(e) => updateService(service.id, "title", e.target.value)}
                              className="font-semibold"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeService(service.id)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Descrição do serviço"
                            value={service.description}
                            onChange={(e) => updateService(service.id, "description", e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button type="button" onClick={addService} variant="outline" className="w-full">
                    <Plus size={16} className="mr-2" />
                    Adicionar Serviço
                  </Button>
                </div>
              </section>

              {/* Galeria de Imagens */}
              <section>
                <h3 className="text-2xl font-semibold uppercase mb-4">Galeria de Imagens</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative aspect-video bg-gray-100">
                      <Image
                        src={url}
                        alt={`Galeria ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="URL da imagem"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addGalleryImage(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input) {
                        addGalleryImage(input.value)
                        input.value = ""
                      }
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </section>

              {/* FAQs */}
              <section>
                <h2 className="text-4xl font-semibold text-center text-gray-900 mb-2">Perguntas Frequentes</h2>
                <p className="text-center text-gray-600 mb-8">
                  Adicione perguntas e respostas comuns
                </p>

                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-[#F3F0E8] p-4 space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Pergunta"
                            value={faq.question}
                            onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                            className="font-medium"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFAQ(faq.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Resposta..."
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                          rows={3}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={addFAQ} variant="outline" className="w-full mt-4">
                  <Plus size={16} className="mr-2" />
                  Adicionar Pergunta
                </Button>
              </section>
            </div>

            {/* Sidebar Direita - 1/3 */}
            <div className="lg:col-span-1 space-y-6">
              <aside className="bg-[#F6F4ED] border border-[#E2DED2] p-4 space-y-4 sticky top-24">
                {/* Informações de Contato */}
                <div className="space-y-2">
                  <div className="bg-white border border-[#E2DED2] px-3 py-3">
                    <div className="flex items-center text-base gap-2 mb-2 font-semibold">
                      <RiMapPin2Fill className="h-4 w-4 text-[#126861]" />
                      <span>Endereço</span>
                    </div>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Endereço completo *"
                      rows={3}
                      required
                      className="text-xs leading-snug"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Cidade"
                        className="text-xs"
                      />
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="UF"
                        maxLength={2}
                        className="text-xs uppercase"
                      />
                    </div>

                    {/* Cidades Adicionais de Atuação */}
                    <div className="mt-3 pt-3 border-t border-[#E2DED2]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Outras Cidades de Atuação</span>
                        <Button
                          type="button"
                          onClick={addAdditionalCity}
                          className="text-xs px-2 py-1 bg-[#126861] text-white hover:bg-[#0e5550] h-7"
                        >
                          + Cidade
                        </Button>
                      </div>
                      {additionalCities.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">
                          Adicione cidades onde você também atende (atendimento domiciliar, etc)
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {additionalCities.map((item) => (
                            <div key={item.id} className="flex gap-2 items-center">
                              <Input
                                value={item.city}
                                onChange={(e) => updateAdditionalCity(item.id, "city", e.target.value)}
                                placeholder="Cidade"
                                className="text-xs flex-1"
                              />
                              <Input
                                value={item.state}
                                onChange={(e) => updateAdditionalCity(item.id, "state", e.target.value.toUpperCase())}
                                placeholder="UF"
                                maxLength={2}
                                className="text-xs w-16 uppercase"
                              />
                              <Button
                                type="button"
                                onClick={() => removeAdditionalCity(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0 flex items-center justify-center"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E2DED2] px-3 py-3">
                    <div className="flex items-center text-base gap-2 mb-2 font-semibold">
                      <FaClock className="h-4 w-4 text-[#126861]" />
                      <span>Horários</span>
                    </div>
                    <Textarea
                      name="working_hours"
                      value={formData.working_hours}
                      onChange={handleInputChange}
                      placeholder="Ex: Seg-Sex: 8h às 18h"
                      rows={3}
                      className="text-xs leading-snug"
                    />
                  </div>

                  <div className="bg-white border border-[#E2DED2] px-3 py-3">
                    <div className="flex items-center text-base gap-2 mb-2 font-semibold">
                      <FaPhoneAlt className="h-4 w-4 text-[#126861]" />
                      <span>Contatos</span>
                    </div>
                    <Textarea
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Telefone *"
                      required
                      rows={2}
                      className="text-xs mb-2"
                    />

                    <Input
                      name="social_whatsapp"
                      value={formData.social_whatsapp}
                      onChange={handleInputChange}
                      placeholder="WhatsApp (com DDD)"
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="pt-2">
                  <p className="text-lg font-semibold text-gray-800 mb-3">Redes Sociais</p>
                  <div className="space-y-2">
                    <Input
                      name="social_facebook"
                      value={formData.social_facebook}
                      onChange={handleInputChange}
                      placeholder="Facebook URL"
                      className="text-xs"
                    />
                    <Input
                      name="social_instagram"
                      value={formData.social_instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram URL"
                      className="text-xs"
                    />
                    <Input
                      name="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn URL"
                      className="text-xs"
                    />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      required
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="pt-2 border-t border-gray-300">
                  <p className="text-lg font-semibold text-gray-800 mb-3">Configurações</p>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Perfil Ativo</span>
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                        className="w-4 h-4"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Profissional em Destaque</span>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
}

interface Professional {
  id: string
  name: string
  slug: string
  title: string
  specialty?: string
  specialties?: string[]
  city?: string
  state?: string
}

interface HeaderProps {
  isHomePage?: boolean
}

export function Header({ isHomePage = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactArea, setContactArea] = useState("")
  const [contactCity, setContactCity] = useState("")

  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Post[]>([])
  const [professionalSuggestions, setProfessionalSuggestions] = useState<Professional[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([])
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([])
  const [specialtySuggestions, setSpecialtySuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/tags`),
        ])

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setAllCategories(data.categories || [])
        }

        if (tagsRes.ok) {
          const data = await tagsRes.json()
          setAllTags(data.tags || [])
        }
      } catch { }
    }

    fetchCategoriesAndTags()
  }, [])

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([])
        setProfessionalSuggestions([])
        setCategorySuggestions([])
        setTagSuggestions([])
        setSpecialtySuggestions([])
        return
      }

      setIsLoadingSuggestions(true)
      try {
        // Buscar posts e profissionais em paralelo
        const [postsRes, professionalsRes] = await Promise.all([
          fetch(`${API_URL}/posts?search=${encodeURIComponent(searchTerm)}&per_page=5&published=true`),
          fetch(`${API_URL}/professionals?search=${encodeURIComponent(searchTerm)}&per_page=5&active=true`)
        ])

        const normalizedTerm = searchTerm.trim().toLowerCase()
        const nextCategorySuggestions = allCategories
          .filter((c) => c.name.toLowerCase().includes(normalizedTerm) || c.slug.toLowerCase().includes(normalizedTerm))
          .slice(0, 5)
        const nextTagSuggestions = allTags
          .filter((t) => t.name.toLowerCase().includes(normalizedTerm) || t.slug.toLowerCase().includes(normalizedTerm))
          .slice(0, 5)

        setCategorySuggestions(nextCategorySuggestions)
        setTagSuggestions(nextTagSuggestions)

        if (postsRes.ok) {
          const data = await postsRes.json()
          setSuggestions(data.posts || [])
        }

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          const professionals = (data.professionals || []) as Professional[]
          setProfessionalSuggestions(professionals)

          const specialtySet = new Set<string>()
          professionals.forEach((p) => {
            if (p.specialty && p.specialty.trim()) specialtySet.add(p.specialty.trim())
            if (Array.isArray(p.specialties)) {
              p.specialties.forEach((s) => {
                if (typeof s === "string" && s.trim()) specialtySet.add(s.trim())
              })
            }
          })

          const nextSpecialtySuggestions = Array.from(specialtySet)
            .filter((s) => s.toLowerCase().includes(normalizedTerm))
            .slice(0, 5)

          setSpecialtySuggestions(nextSpecialtySuggestions)
        }
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, allCategories, allTags])

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchTerm("")
        setSuggestions([])
        setProfessionalSuggestions([])
        setCategorySuggestions([])
        setTagSuggestions([])
        setSpecialtySuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleSendWhatsApp = () => {
    if (!contactName || !contactArea) return

    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5581999999999"
    const message = encodeURIComponent(
      `Olá, meu nome é ${contactName}, sou de ${contactCity} e atuo na área de ${contactArea}. Gostaria de entrar em contato pelo portal Olá Guia.`,
    )
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    window.open(url, "_blank")
    setIsContactModalOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-t-4 border-[#126861] shadow-md",
        isScrolled ? "bg-[#f5f5f0] py-3" : "bg-[#f5f5f0] py-4",
      )}
    >
      <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/olaguia.png" alt="Logo" width={300} height={80} className="max-w-32 md:max-w-48" />
          <Image src="/20anos.png" alt="Logo" width={300} height={80} className="max-w-14 md:max-w-20" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm text-[#126861] transition-colors hover:text-[#7a6b5a]"
          >
            HOME
          </Link>
          <Link
            href="/blog?tag=sobre-nos"
            className="text-sm text-[#126861] transition-colors hover:text-[#7a6b5a]"
          >
            SOBRE NÓS
          </Link>
          <Link
            href="/blog?tag=revista"
            className="text-sm text-[#126861] transition-colors hover:text-[#7a6b5a]"
          >
            REVISTA
          </Link>
          <Link
            href="/blog?tag=portal"
            className="text-sm text-[#126861] transition-colors hover:text-[#7a6b5a]"
          >
            PORTAL
          </Link>
          <button
            type="button"
            onClick={handleOpenContactModal}
            className="text-sm text-[#126861] transition-colors hover:text-[#126861]"
          >
            CONTATO
          </button>
        </nav>

        {/* Right Side Icons and Login */}
        <div className="hidden md:flex items-center space-x-4">
          <Button onClick={handleOpenContactModal} className="bg-transparent border-2 border-[#126861] hover:bg-[#126861] text-[#126861] rounded-full font-semibold px-4 text-xs">
            ANUNCIE
          </Button>

          {/* Search */}
          <div ref={searchRef} className="relative">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="h-5 w-5 text-[#126861]" />
              </button>
            ) : (
              <div className="flex items-center">
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    if (searchTerm.trim()) {
                      window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-32 px-4 py-2 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#126861] hover:text-[#0f5650]"
                    aria-label="Pesquisar"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Sugestões de posts e profissionais */}
                {searchTerm.trim().length > 1 && (
                  <div className="absolute z-50 top-full mt-2 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoadingSuggestions &&
                      suggestions.length === 0 &&
                      professionalSuggestions.length === 0 &&
                      categorySuggestions.length === 0 &&
                      tagSuggestions.length === 0 &&
                      specialtySuggestions.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">Buscando...</div>
                      )}

                    {!isLoadingSuggestions &&
                      suggestions.length === 0 &&
                      professionalSuggestions.length === 0 &&
                      categorySuggestions.length === 0 &&
                      tagSuggestions.length === 0 &&
                      specialtySuggestions.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">Nenhum resultado encontrado.</div>
                      )}

                    {/* Profissionais */}
                    {professionalSuggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          Profissionais
                        </div>
                        {professionalSuggestions.map((professional) => (
                          <Link
                            key={professional.id}
                            href={`/profissional/${professional.slug}`}
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchTerm("")
                              setSuggestions([])
                              setProfessionalSuggestions([])
                              setCategorySuggestions([])
                              setTagSuggestions([])
                              setSpecialtySuggestions([])
                            }}
                            className="block px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-100"
                          >
                            <div className="font-medium text-gray-900">{professional.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {professional.title}
                              {professional.city && ` • ${professional.city}`}
                              {professional.state && ` - ${professional.state}`}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Posts */}
                    {suggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          Artigos
                        </div>
                        {suggestions.map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchTerm("")
                              setSuggestions([])
                              setProfessionalSuggestions([])
                              setCategorySuggestions([])
                              setTagSuggestions([])
                              setSpecialtySuggestions([])
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                          >
                            {post.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Categorias */}
                    {categorySuggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          Categorias
                        </div>
                        {categorySuggestions.map((category) => (
                          <Link
                            key={category.id}
                            href={`/blog?category=${encodeURIComponent(category.slug)}`}
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchTerm("")
                              setSuggestions([])
                              setProfessionalSuggestions([])
                              setCategorySuggestions([])
                              setTagSuggestions([])
                              setSpecialtySuggestions([])
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {tagSuggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          Tags
                        </div>
                        {tagSuggestions.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchTerm("")
                              setSuggestions([])
                              setProfessionalSuggestions([])
                              setCategorySuggestions([])
                              setTagSuggestions([])
                              setSpecialtySuggestions([])
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Especialidades */}
                    {specialtySuggestions.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          Especialidades
                        </div>
                        {specialtySuggestions.map((specialty) => (
                          <Link
                            key={specialty}
                            href={`/profissionais?search=${encodeURIComponent(specialty)}`}
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchTerm("")
                              setSuggestions([])
                              setProfessionalSuggestions([])
                              setCategorySuggestions([])
                              setTagSuggestions([])
                              setSpecialtySuggestions([])
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                          >
                            {specialty}
                          </Link>
                        ))}
                      </div>
                    )}

                    {(suggestions.length > 0 ||
                      professionalSuggestions.length > 0 ||
                      categorySuggestions.length > 0 ||
                      tagSuggestions.length > 0 ||
                      specialtySuggestions.length > 0) && (
                        <div className="border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              if (searchTerm.trim()) {
                                window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-[#126861] hover:bg-gray-100"
                          >
                            Ver resultados em artigos para "{searchTerm}"
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (searchTerm.trim()) {
                                window.location.href = `/profissionais?search=${encodeURIComponent(searchTerm)}`
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-[#126861] hover:bg-gray-100"
                          >
                            Ver resultados em profissionais para "{searchTerm}"
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="md:hidden bg-transparent border-2 border-[#928575] hover:bg-[#928575] text-[#928575] rounded-full font-semibold px-4 h-fit text-[10px]">
            ANUNCIE
          </Button>

          {/* Mobile: Logo à esquerda e Hamburger à direita na Home */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#928575]" />
            ) : (
              <Menu className="h-6 w-6 text-[#928575]" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown (apenas na Home) */}
      {isHomePage && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#928575] py-2 hover:text-[#7a6b5a] transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/blog?tag=sobre-nos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#928575] py-2 hover:text-[#7a6b5a] transition-colors"
            >
              SOBRE NÓS
            </Link>
            <Link
              href="/blog?tag=revista"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#928575] py-2 hover:text-[#7a6b5a] transition-colors"
            >
              REVISTA
            </Link>
            <Link
              href="/blog?tag=portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-[#928575] py-2 hover:text-[#7a6b5a] transition-colors"
            >
              PORTAL
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleOpenContactModal()
              }}
              className="text-sm font-medium text-[#928575] py-2 text-left hover:text-[#126861] transition-colors"
            >
              CONTATO
            </button>
            <Button className="bg-[#928575] hover:bg-[#7a6b5a] text-white rounded-full px-6 text-sm w-fit">
              ANÚNCIE
            </Button>
          </nav>
        </div>
      )}
      {/* Mobile Navigation removida em favor do menu fixo inferior */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Fale conosco pelo WhatsApp</h2>
            <p className="text-sm text-gray-600 mb-4">
              Informe seus dados para iniciarmos a conversa pelo WhatsApp.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-name">
                  Nome
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-area">
                  Área de atuação
                </label>
                <input
                  id="contact-area"
                  type="text"
                  value={contactArea}
                  onChange={(e) => setContactArea(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Ex: Psicologia, Nutrição, Fisioterapia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-area">
                  Cidade
                </label>
                <input
                  id="contact-city"
                  type="text"
                  value={contactCity}
                  onChange={(e) => setContactCity(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Nome da cidade"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseContactModal}>
                Cancelar
              </Button>
              <Button
                className="bg-[#126861] hover:bg-[#0f5650] text-white"
                onClick={handleSendWhatsApp}
                disabled={!contactName || !contactArea}
              >
                Enviar para WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

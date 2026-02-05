"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, ChevronDown, BookOpen, Library, Grid2X2 } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"

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

interface PostSuggestion {
  id: string
  title: string
  slug: string
}

interface Professional {
  id: string
  name: string
  slug: string
  title: string
  city?: string
  state?: string
}

interface BlogSidebarNewProps {
  categories: Category[]
  tags: Tag[]
}

interface HomeSlot {
  id: string
  section: string
  position: string
  slot_index: number | null
  order: number
  post_id: string | null
  post: any | null
}

export function BlogSidebarNew({ categories, tags }: BlogSidebarNewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([])
  const [professionalSuggestions, setProfessionalSuggestions] = useState<Professional[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isRevistaExpanded, setIsRevistaExpanded] = useState(true)
  const [slots, setSlots] = useState<HomeSlot[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes, adsRes] = await Promise.all([
          fetch(`${API_URL}/home-slots`),
          fetch(`${API_URL}/ads?active_only=true`),
        ])

        if (slotsRes.ok) {
          const slotsData = await slotsRes.json()
          setSlots(slotsData.slots || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
      }
    }

    fetchData()
  }, [])

  // Buscar sugestões de posts e profissionais
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([])
        setProfessionalSuggestions([])
        return
      }

      setIsLoadingSuggestions(true)
      try {
        const [postsRes, professionalsRes] = await Promise.all([
          fetch(`${API_URL}/posts?search=${encodeURIComponent(searchTerm)}&per_page=5&published=true`),
          fetch(`${API_URL}/professionals?search=${encodeURIComponent(searchTerm)}&per_page=5&active=true`)
        ])

        if (postsRes.ok) {
          const data = await postsRes.json()
          setSuggestions(data.posts || [])
        }

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          setProfessionalSuggestions(data.professionals || [])
        }
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, API_URL])



  const getSlots = (section: string, position: string) => {
    return slots
      .filter((slot) => slot.section === section && slot.position === position)
      .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
  }
  // Buscar sugestões de posts conforme o usuário digita (com debounce)
  useEffect(() => {
    const term = searchTerm.trim()

    if (term.length < 2) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true)
        const res = await fetch(
          `${API_URL}/posts?search=${encodeURIComponent(term)}&per_page=5`,
          { signal: controller.signal },
        )

        if (!res.ok) {
          setSuggestions([])
          return
        }

        const data = await res.json()
        const posts = (data.posts || []) as PostSuggestion[]
        setSuggestions(posts)
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [searchTerm, API_URL])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Helper function to normalize slug (same as backend)
  const normalizeSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]/g, '') // Remove special characters
  }

  // Helper function to find tag by name
  const findTagByName = (name: string) => {
    const normalizedSearchName = name.toLowerCase().trim()
    const normalizedSearchSlug = normalizeSlug(name)

    // Try exact match first
    let tag = tags.find(t =>
      t.name.toLowerCase().trim() === normalizedSearchName ||
      t.slug.toLowerCase() === normalizedSearchSlug
    )

    // If not found, try partial match
    if (!tag) {
      tag = tags.find(t =>
        t.name.toLowerCase().includes(normalizedSearchName) ||
        normalizedSearchName.includes(t.name.toLowerCase())
      )
    }

    // Debug log
    if (process.env.NODE_ENV === 'development' && !tag) {
      console.log(`Tag not found for: "${name}" (normalized: "${normalizedSearchSlug}")`)
      console.log('Available tags:', tags.map(t => ({ name: t.name, slug: t.slug })))
    }

    return tag
  }

  const revistaCategories = [
    {
      label: "Reflexão",
      slug: "reflexao"
    },
    {
      label: "Relacionamento",
      slug: "relacionamento"
    },
    {
      label: "OLÁ Gourmet",
      slug: "olagourmet"
    },
    {
      label: "Super Dicas",
      slug: "superdicas"
    },
    {
      label: "Quebra Cuca",
      slug: "quebracuca"
    },
    {
      label: "Rindo à Toa",
      slug: "rindoatoa"
    },
    {
      label: "Provérbios & Citações",
      slug: "provencitas"
    },
    {
      label: "Edições Anteriores",
      slug: "edicoesanteriores"
    }
  ]

  const parceirosCategories = [
    "Empresas & Negócios",
    "Mantendo & Reformando",
    "Gastronomia",
    "Saúde",
    "Estética",
    "Serviços",
  ]

  const bibliotecaCategories = [
    "EMPREENDEDORISMO",
    "FINANÇAS",
    "VENDAS",
    "INTERNET",
    "MARKETING",
    "PUBLICIDADE",
  ]

  return (
    <div className="w-full space-y-8 lg:sticky lg:self-start border-2 px-6 py-4">
      {/* PESQUISAR */}
      <div>
        <h3 className="text-2xl font-semibold font-open-sans text-gray-900 mb-4 tracking-wide">Pesquisar</h3>
        <p className="text-sm text-gray-600 mb-4">
          Pesquisa geral em todo o portal (palavra ou expressão)
        </p>
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
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126861]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#126861] hover:text-[#0f5650]"
            aria-label="Pesquisar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </button>

          {/* Sugestões de posts e profissionais */}
          {searchTerm.trim().length > 1 && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {isLoadingSuggestions && suggestions.length === 0 && professionalSuggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">Buscando sugestões...</div>
              )}

              {!isLoadingSuggestions && suggestions.length === 0 && professionalSuggestions.length === 0 && (
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}

              {(suggestions.length > 0 || professionalSuggestions.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-[#126861] hover:bg-gray-100 border-t border-gray-200"
                >
                  Ver todos os resultados para "{searchTerm}"
                </button>
              )}
            </div>
          )}
        </form>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* REVISTA */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold font-open-sans text-gray-900 tracking-wide">Revista</h3>
          {/* <button
            onClick={() => setIsRevistaExpanded(prev => !prev)}
            className="w-8 h-8 rounded-full bg-[#928575] flex items-center justify-center hover:bg-[#928575] transition-colors"
            aria-label="Expandir/collapse revista"
            type="button"
          >
            {isRevistaExpanded ? (
              // Up arrow
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              // Down arrow
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button> */}
        </div>
        {isRevistaExpanded && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Veja as dicas e curiosidades que você costuma ler na Revista Impressa.
            </p>
            <div className="space-y-2">
              {revistaCategories.map((category) => {

                return (
                  <Link
                    key={category.slug}
                    href={`/blog?category=${category.slug}`}
                    className="flex items-center gap-2 group"
                  >
                    <BookOpen width={20} height={20} className="text-[#928575]" />
                    <span className="text-sm text-gray-700 group-hover:text-[#126861] transition-colors">
                      {category.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
      <div className="border-t border-gray-300"></div>

      {/* CATEGORIAS DE PARCEIROS */}
      <div>
        <h3 className="text-2xl font-semibold font-open-sans text-gray-900 mb-4 tracking-wide">Artigos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Aqui você encontra os artigos organizados por categoria
        </p>
        <div className="space-y-2">
          {[
            {
              label: "Saúde",
              slug: "saude"
            },
            {
              label: "Estética Beleza",
              slug: "estetica-beleza"
            },
            {
              label: "Empresas & Negócios",
              slug: "empresas-negocios"
            },
            {
              label: "Mantendo & Reformando",
              slug: "mantendo-reformando"
            },
            {
              label: "Gastronomia",
              slug: "gastronomia"
            },
            {
              label: "Serviços",
              slug: "servicos"
            }
          ].map((cat) => {

            return (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="flex items-center gap-2 group"
              >
                <Grid2X2 width={20} height={20} className="text-[#928575]" />
                <span className="text-sm text-gray-700 group-hover:text-[#126861] transition-colors">
                  <span>{cat.label}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="border-t-2 border-gray-300"></div>

      {/* BIBLIOTECA TÉCNICA */}
      <div>
        <h3 className="text-2xl font-semibold font-open-sans text-gray-900 mb-4 tracking-wide">Biblioteca Técnica</h3>
        <p className="text-sm text-gray-600 mb-4">
          Os melhores conceitos, técnicas e ferramentas para a melhoria do seu negócio.
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "EMPREENDEDORISMO", value: "empreendedorismo" },
            { label: "FINANÇAS", value: "financas" },
            { label: "VENDAS", value: "vendas" },
            { label: "INTERNET", value: "internet" },
            { label: "MARKETING", value: "marketing" },
            { label: "PUBLICIDADE", value: "publicidade" }
          ].map((item) => {
            return (
              <Link
                key={item.value}
                href={`/blog?category=${item.value}`}
                className="flex items-center gap-2 group"
              >
                <Library width={20} height={20} className="text-[#928575]" />
                <span className="text-sm text-gray-700 group-hover:text-[#126861] transition-colors">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* SOBRE NÓS */}
      <div>
        <h3 className="text-2xl font-semibold font-open-sans text-gray-900 mb-4 tracking-wide">Sobre Nós</h3>
        <p className="text-sm text-gray-600 mb-4">
          Aqui você encontra nossa história e nossa missão.
        </p>
        <div className="space-y-6">
          {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot, index) => {
            const post = slot.post
            if (!post) return null

            return (
              <Link key={slot.id} href={`/blog/${post.slug}`} className={`flex flex-col group ${index !== 2 ? "border-b border-[#EEEEEE] pb-4" : ""}`}>
                <div className="relative w-full h-28 mb-3">
                  <Image
                    src={post.featured_image || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-open-sans font-semibold text-sm text-gray-700 uppercase line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-xs font-lato text-gray-600 line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="font-lato text-[10px] italic text-gray-600 border border-gray-300 px-3 py-1 uppercase">
                    LEIA MAIS
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* NEWSLETTER */}
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Quer receber notícias e novidades sobre nosso conteúdo?
        </p>
        <p className="text-sm text-gray-900 mb-3 font-semibold">Entre para nossos canais:</p>
        <div className="flex flex-col gap-3">
          <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-5 py-2 rounded-none text-sm font-semibold border border-gray-300">
            Leitores
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-5 py-2 rounded-none text-sm font-semibold border border-gray-300">
            Parceiros
          </Button>
        </div>
        {/* <button
          className="w-fit bg-[#928575] hover:bg-[#928575]/80 text-white text-xs px-4 py-2 rounded-3xl uppercase"
          type="button"
        >
          ENTRAR NO GRUPO
        </button> */}
      </div>
    </div>
  )
}


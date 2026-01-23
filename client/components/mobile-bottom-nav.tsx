"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Users, Grid2X2, BookOpen, Library, X, ChevronDown, Search } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

type MenuSection = "parceiros" | "categorias" | "revista" | "biblioteca" | "search" | null

interface Professional {
  id: string
  name: string
  title: string
  specialty: string
  city: string
  state: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

const navItems = [
  { key: "parceiros" as const, label: "Parceiros", icon: Users },
  { key: "categorias" as const, label: "Categoria", icon: Grid2X2 },
  { key: "revista" as const, label: "Revista", icon: BookOpen },
  { key: "biblioteca" as const, label: "Biblioteca", icon: Library },
  { key: "search" as const, label: "Busca", icon: Search }
]

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

const categoriasItems = [
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
]

const bibliotecaItems = [
  "EMPREENDEDORISMO",
  "FINANÇAS",
  "VENDAS",
  "INTERNET",
  "MARKETING",
  "PUBLICIDADE",
]

// Helper function to normalize slug
const normalizeSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

export function MobileBottomNav() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<MenuSection>(null)

  // Estados para busca de parceiros
  const [cidade, setCidade] = useState("")
  const [profissional, setProfissional] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [tema, setTema] = useState("")

  // Estados para busca de blog
  const [search, setSearch] = useState("")

  // Dados dinâmicos
  const [cidades, setCidades] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<Professional[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [temas, setTemas] = useState<string[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([])
  const lastCityRef = useRef<string>("")

  const normalize = (value: string) => value.trim().toLowerCase()

  const extractCities = (p: Professional) => {
    const cityNames: string[] = []
    if (p.city) cityNames.push(p.city)
    if (Array.isArray((p as any).additional_cities)) {
      ; (p as any).additional_cities.forEach((c: any) => {
        if (c?.city) cityNames.push(c.city)
      })
    }
    return cityNames
  }

  const splitSpecialtyText = (value: string) => {
    return value
      .split(/\r?\n|•|,|;|\s+-\s+/g)
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const extractAreaOptions = (p: Professional) => {
    const options: string[] = []
    if ((p as any).title) options.push((p as any).title)
    if ((p as any).specialty) options.push(...splitSpecialtyText((p as any).specialty))
    if (Array.isArray((p as any).specialties)) {
      ; (p as any).specialties.forEach((s: any) => {
        if (typeof s === "string" && s.trim()) options.push(s.trim())
      })
    }
    return options
  }

  const matchesCity = (p: Professional, selectedCity: string) => {
    if (!selectedCity) return true
    const selected = normalize(selectedCity)
    return extractCities(p).some((c) => normalize(c) === selected)
  }

  // Carregar dados quando abrir seção de parceiros
  useEffect(() => {
    if (activeSection === "parceiros" && cidades.length === 0) {
      fetchParceirosData()
    }
    if ((activeSection === "parceiros" || activeSection === "revista" || activeSection === "categorias" || activeSection === "biblioteca") && tags.length === 0) {
      fetchTags()
    }
  }, [activeSection])

  const fetchParceirosData = async () => {
    setIsLoading(true)
    try {
      const [professionalsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/professionals?per_page=100&active=true`),
        fetch(`${API_URL}/categories`),
      ])

      if (professionalsRes.ok) {
        const data = await professionalsRes.json()
        const professionals = data.professionals || []
        setAllProfessionals(professionals)
        setProfissionais(professionals)

        const cidadesUnicas = [
          ...new Set(
            professionals
              .flatMap((p: Professional) => extractCities(p))
              .filter(Boolean)
          ),
        ].sort() as string[]
        setCidades(cidadesUnicas)

        const areaMap = new Map<string, string>()
        professionals.forEach((p: Professional) => {
          extractAreaOptions(p).forEach((opt) => {
            const key = normalize(opt)
            if (!areaMap.has(key)) areaMap.set(key, opt)
          })
        })
        setEspecialidades(Array.from(areaMap.values()).sort((a, b) => a.localeCompare(b, "pt-BR")))
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        const categoryNames = (categoriesData.categories || []).map((cat: any) => cat.name).sort()
        setTemas(categoryNames)
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (allProfessionals.length === 0) return

    const filtered = allProfessionals.filter((p) => matchesCity(p, cidade))
    const areaMap = new Map<string, string>()

    filtered.forEach((p) => {
      extractAreaOptions(p).forEach((opt) => {
        const key = normalize(opt)
        if (!areaMap.has(key)) areaMap.set(key, opt)
      })
    })

    setEspecialidades(Array.from(areaMap.values()).sort((a, b) => a.localeCompare(b, "pt-BR")))

    if (lastCityRef.current !== cidade) {
      if (especialidade && !areaMap.has(normalize(especialidade))) {
        setEspecialidade("")
      }
      lastCityRef.current = cidade
    }
  }, [cidade, allProfessionals])

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/tags`)
      if (res.ok) {
        const data = await res.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error("Erro ao buscar tags:", error)
    }
  }

  const findTagByName = (name: string) => {
    const normalizedSearchName = name.toLowerCase().trim()
    const normalizedSearchSlug = normalizeSlug(name)

    let tag = tags.find(
      (t) =>
        t.name.toLowerCase().trim() === normalizedSearchName ||
        t.slug.toLowerCase() === normalizedSearchSlug
    )

    if (!tag) {
      tag = tags.find(
        (t) =>
          t.name.toLowerCase().includes(normalizedSearchName) ||
          normalizedSearchName.includes(t.name.toLowerCase())
      )
    }

    return tag
  }

  const handleParceirosSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (cidade) params.append("city", cidade)
    if (profissional) params.append("name", profissional)
    if (especialidade) params.append("specialty", especialidade)
    if (tema) params.append("category", tema)
    router.push(`/profissionais?${params.toString()}`)
    setActiveSection(null)
  }

  const handleTagClick = (tagName: string) => {
    const tag = findTagByName(tagName)
    const tagSlug = tag?.slug || normalizeSlug(tagName)
    router.push(`/blog?tag=${tagSlug}`)
    setActiveSection(null)
  }

  const handleBuscaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    router.push(`/blog?${params.toString()}`)
    setActiveSection(null)
  }

  const toggleSection = (section: MenuSection) => {
    setActiveSection((prev) => (prev === section ? null : section))
  }

  return (
    <>
      {/* Overlay do painel */}
      {activeSection && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setActiveSection(null)}
        />
      )}

      {/* Painel deslizante */}
      <div
        className={`fixed left-4 right-4hxGg.CEgy'uguya4J5R) bottom-[100px] z-50 bg-[#f5f5f0] rounded-3xl shadow-2xl transition-transform duration-300 ease-out md:hidden ${activeSection ? "translate-y-0" : "translate-y-full hidden"
          }`}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        {/* Botão fechar */}
        <div className="sticky top-0 bg-[#f5f5f0] px-4 py-3 flex justify-end border-b border-gray-200 rounded-t-3xl">
          <button
            onClick={() => setActiveSection(null)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-6">
          {/* PARCEIROS - Busca com filtros */}
          {activeSection === "parceiros" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#353E5C] uppercase">Pesquisar Parceiros</h2>
              <p className="text-sm text-gray-600">
                Encontre Profissionais e Empresas por Cidade e/ou Nome e/ou Especialidade e/ou Tema específico
              </p>

              <form onSubmit={handleParceirosSubmit} className="space-y-3">
                {/* Cidade */}
                <div className="relative">
                  <select
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#928575] rounded-full appearance-none bg-white text-[#928575] text-sm uppercase disabled:opacity-50"
                  >
                    <option value="">CIDADE</option>
                    {cidades.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#928575] pointer-events-none" />
                </div>

                {/* Profissional / Empresa */}
                <div className="relative">
                  <select
                    value={profissional}
                    onChange={(e) => setProfissional(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#928575] rounded-full appearance-none bg-white text-[#928575] text-sm uppercase disabled:opacity-50"
                  >
                    <option value="">PROFISSIONAL / EMPRESA</option>
                    {profissionais.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} {p.title && `- ${p.title}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#928575] pointer-events-none" />
                </div>

                {/* Especialidade */}
                <div className="relative">
                  <select
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#928575] rounded-full appearance-none bg-white text-[#928575] text-sm uppercase disabled:opacity-50"
                  >
                    <option value="">ESPECIALIDADE</option>
                    {especialidades.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#928575] pointer-events-none" />
                </div>

                {/* Tema */}
                <div className="relative">
                  <select
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#928575] rounded-full appearance-none bg-white text-[#928575] text-sm uppercase disabled:opacity-50"
                  >
                    <option value="">TEMA</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#928575] pointer-events-none" />
                </div>

                {/* Botão de busca */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-14 h-14 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 mx-auto mt-4"
                >
                  <Search className="h-6 w-6" />
                </button>
              </form>
            </div>
          )}

          {/* REVISTA */}
          {activeSection === "revista" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">Revista</h2>
              <p className="text-sm text-gray-600">
                Aqui você pode ver todas as matérias já publicadas na revista impressa, é só escolher o tema e clicar!
              </p>

              <div className="space-y-2">
                {revistaCategories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => {
                      router.push(`/blog?category=${category.slug}`)
                      setActiveSection(null)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Image src="/logoicon.png" alt={category.label} width={24} height={24} />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIAS */}
          {activeSection === "categorias" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">Categorias</h2>
              <p className="text-sm text-gray-600">
                Quer conhecer os profissionais e Empresas parceiras do OLÁ GUIA?
                Busque pela categoria clicando abaixo.
              </p>

              <div className="space-y-2">
                {categoriasItems.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      const tag = findTagByName(cat.slug)
                      const tagSlug = tag?.slug || normalizeSlug(cat.slug)
                      router.push(`/blog?category=${cat.slug}`)
                      setActiveSection(null)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Image src="/logoicon.png" alt={cat.label} width={24} height={24} />
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BUSCA */}
          {activeSection === "search" && (
            /* w-full garante 100%, px-4 garante os 16px de cada lado internamente */
            <div className="w-full px-4 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">Busca</h2>

              <div className="relative space-y-4 w-full">
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    if (search.trim()) {
                      window.location.href = `/blog?search=${encodeURIComponent(search)}`
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 pr-14 border-2 border-[#928575] rounded-full appearance-none bg-white text-[#928575] text-sm uppercase disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#126861] hover:bg-[#0f5650] text-white rounded-full flex items-center justify-center transition-colors w-10 h-10"
                    aria-label="Pesquisar"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* BIBLIOTECA TÉCNICA */}
          {activeSection === "biblioteca" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#126861] uppercase">Biblioteca Técnica</h2>
              <p className="text-sm text-gray-600">
                Esta biblioteca está cheia de conteúdos selecionados para ajudar você, para crescer na sua carreira e no seu negócio. Aproveite clicando nos itens abaixo!
              </p>

              <div className="grid grid-cols-2 gap-3">
                {bibliotecaItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleTagClick(item)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de navegação flutuante com transparência e blur */}
      <nav className="fixed w-full bottom-0 z-50 bg-white shadow-md overflow-hidden md:hidden">

        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.key

            return (
              <button
                key={item.key}
                onClick={() => toggleSection(item.key)}
                className="flex flex-col items-center gap-1 text-xs"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${item.key === "search"
                    ? "bg-[#F6F4ED] text-[#7a6b5a]"
                    : isActive
                      ? "bg-[#7a6b5a] text-white"
                      : "bg-[#928575] text-white"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`font-medium transition-colors ${item.key === "search"
                    ? "text-[#7a6b5a]"
                    : isActive
                      ? "text-[#7a6b5a]"
                      : "text-[#928575]"
                    }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

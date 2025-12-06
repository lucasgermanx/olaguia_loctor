"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  slug: string
  title: string
  specialty: string
  city: string
  state: string
}

// Extrair nome base do slug (removendo o último segmento após o último hífen)
const getBaseSlug = (slug: string): string => {
  let baseSlug = slug.toLowerCase().trim()
  const lastHyphenIndex = baseSlug.lastIndexOf('-')
  if (lastHyphenIndex > 0) {
    baseSlug = baseSlug.substring(0, lastHyphenIndex)
  }
  return baseSlug.trim()
}

// Extrair nome base do nome (removendo sufixos como " - SP", " - RJ")
const getBaseName = (name: string): string => {
  const patterns = [
    /\s*-\s*[A-Z]{2}$/i, // " - SP", " - RJ"
    /\s*\([^)]*\)$/,     // "(São Paulo)", "(Rio de Janeiro)"
  ]
  let baseName = name.trim()
  patterns.forEach(pattern => {
    baseName = baseName.replace(pattern, '')
  })
  return baseName.trim()
}

export function MainSearchBar() {
  const router = useRouter()
  const [cidade, setCidade] = useState("")
  const [profissional, setProfissional] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [tema, setTema] = useState("")

  // Estados para controlar a exibição das sugestões
  const [showCidadeSuggestions, setShowCidadeSuggestions] = useState(false)
  const [showProfissionalSuggestions, setShowProfissionalSuggestions] = useState(false)
  const [showEspecialidadeSuggestions, setShowEspecialidadeSuggestions] = useState(false)
  const [showTemaSuggestions, setShowTemaSuggestions] = useState(false)

  // Dados dinâmicos da API
  const [cidades, setCidades] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<Professional[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [temas, setTemas] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar todos os profissionais ativos (limite máximo: 100)
        const professionalsUrl = `${API_URL}/professionals?per_page=100`
        const tagsUrl = `${API_URL}/tags`

        const [professionalsRes, tagsRes] = await Promise.all([
          fetch(professionalsUrl),
          fetch(tagsUrl)
        ])

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          const professionals = data.professionals || []

          // Filtrar profissionais únicos pelo nome base (mesmo nome = aparece uma vez)
          const uniqueProfessionalsMap = new Map<string, Professional>()
          professionals.forEach((p: Professional) => {
            const baseName = getBaseName(p.name)
            // Mantém apenas o primeiro profissional com cada nome base
            if (!uniqueProfessionalsMap.has(baseName)) {
              uniqueProfessionalsMap.set(baseName, { ...p, name: baseName })
            }
          })
          const uniqueProfessionals = Array.from(uniqueProfessionalsMap.values())

          setProfissionais(uniqueProfessionals)

          // Extrair cidades únicas
          const cidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.city)
              .map((p: Professional) => p.city)
          )].sort() as string[]

          setCidades(cidadesUnicas)

          // Extrair especialidades únicas
          const especialidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.title)
              .map((p: Professional) => p.title)
          )].sort() as string[]

          setEspecialidades(especialidadesUnicas)
        }

        // Buscar tags (temas)
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          const tagNames = (tagsData.tags || [])
            .map((tag: any) => tag.name)
            .sort()

          setTemas(tagNames)
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construir URL de busca com filtros
    const params = new URLSearchParams()

    if (cidade) params.append("city", cidade)
    if (profissional) params.append("name", profissional)
    if (especialidade) params.append("specialty", especialidade)
    if (tema) params.append("tag", tema)

    // Redirecionar para página de listagem de profissionais com filtros
    router.push(`/profissionais?${params.toString()}`)
  }

  // Filtrar sugestões
  const filteredCidades = cidades.filter(c =>
    c.toLowerCase().includes(cidade.toLowerCase())
  )
  const filteredProfissionais = profissionais.filter(p =>
    p.name.toLowerCase().includes(profissional.toLowerCase())
  )
  const filteredEspecialidades = especialidades.filter(e =>
    e.toLowerCase().includes(especialidade.toLowerCase())
  )
  const filteredTemas = temas.filter(t =>
    t.toLowerCase().includes(tema.toLowerCase())
  )

  return (
    <section className="bg-[#F3F0E8] py-8 md:py-10">
      <div className="w-full mx-auto max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex text-start items-center justify-start gap-4">
            {/* <h2 className="text-2xl md:text-3xl font-bold text-[#353E5C] mb-4">Pesquisar</h2> */}
            <p className="text-gray-600 text-sm mb-4">
              Encontre profissionais e empresas por localização, especialidade ou categoria
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 uppercase">
            {/* Cidade */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                onFocus={() => setShowCidadeSuggestions(true)}
                onBlur={() => setTimeout(() => setShowCidadeSuggestions(false), 200)}
                disabled={isLoading}
                placeholder="Cidade"
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {showCidadeSuggestions && cidade && filteredCidades.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCidades.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setCidade(c)
                        setShowCidadeSuggestions(false)
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#928575] uppercase"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profissional / Empresa */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                onFocus={() => setShowProfissionalSuggestions(true)}
                onBlur={() => setTimeout(() => setShowProfissionalSuggestions(false), 200)}
                disabled={isLoading}
                placeholder="Profissional / Empresa"
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {showProfissionalSuggestions && profissional && filteredProfissionais.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProfissionais.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setProfissional(p.name)
                        setShowProfissionalSuggestions(false)
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#928575] uppercase"
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profissão */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                onFocus={() => setShowEspecialidadeSuggestions(true)}
                onBlur={() => setTimeout(() => setShowEspecialidadeSuggestions(false), 200)}
                disabled={isLoading}
                placeholder="Área de Atuação"
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {showEspecialidadeSuggestions && especialidade && filteredEspecialidades.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredEspecialidades.map((e) => (
                    <div
                      key={e}
                      onClick={() => {
                        setEspecialidade(e)
                        setShowEspecialidadeSuggestions(false)
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#928575] uppercase"
                    >
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tema */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                onFocus={() => setShowTemaSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTemaSuggestions(false), 200)}
                disabled={isLoading}
                placeholder="Tema"
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {showTemaSuggestions && tema && filteredTemas.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredTemas.map((t) => (
                    <div
                      key={t}
                      onClick={() => {
                        setTema(t)
                        setShowTemaSuggestions(false)
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#928575] capitalize"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de busca */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#126861] hover:bg-[#0f5650] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}


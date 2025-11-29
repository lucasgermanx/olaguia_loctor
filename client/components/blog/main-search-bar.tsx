"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  title: string
  specialty: string
  city: string
  state: string
}

export function MainSearchBar() {
  const router = useRouter()
  const [cidade, setCidade] = useState("")
  const [profissional, setProfissional] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [tema, setTema] = useState("")

  // Dados dinâmicos da API
  const [cidades, setCidades] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<Professional[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [temas, setTemas] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Iniciando busca de dados para filtros...")
        console.log("API_URL:", API_URL)

        // Buscar todos os profissionais ativos (limite máximo: 100)
        const professionalsUrl = `${API_URL}/professionals?per_page=100&active=true`
        const categoriesUrl = `${API_URL}/categories`

        console.log("📡 Buscando profissionais de:", professionalsUrl)
        console.log("📡 Buscando categorias de:", categoriesUrl)

        const [professionalsRes, categoriesRes] = await Promise.all([
          fetch(professionalsUrl),
          fetch(categoriesUrl)
        ])

        console.log("📊 Status profissionais:", professionalsRes.status)
        console.log("📊 Status categorias:", categoriesRes.status)

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          const professionals = data.professionals || []

          console.log("✅ Profissionais encontrados:", professionals.length)
          console.log("📋 Amostra de profissionais:", professionals.slice(0, 3))

          setProfissionais(professionals)

          // Extrair cidades únicas
          const cidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.city)
              .map((p: Professional) => p.city)
          )].sort() as string[]

          console.log("🏙️ Cidades encontradas:", cidadesUnicas)
          setCidades(cidadesUnicas)

          // Extrair especialidades únicas
          const especialidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.specialty)
              .map((p: Professional) => p.specialty)
          )].sort() as string[]

          console.log("💼 Especialidades encontradas:", especialidadesUnicas)
          setEspecialidades(especialidadesUnicas)
        } else {
          console.error("❌ Erro ao buscar profissionais:", professionalsRes.status, professionalsRes.statusText)
          const errorText = await professionalsRes.text()
          console.error("❌ Resposta do servidor:", errorText)
        }

        // Buscar categorias (temas)
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const categoryNames = (categoriesData.categories || [])
            .map((cat: any) => cat.name)
            .sort()

          console.log("🏷️ Categorias encontradas:", categoryNames)
          setTemas(categoryNames)
        } else {
          console.error("❌ Erro ao buscar categorias:", categoriesRes.status, categoriesRes.statusText)
        }
      } catch (error) {
        console.error("🚨 Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
        console.log("✅ Carregamento finalizado")
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
    if (tema) params.append("category", tema)

    // Redirecionar para página de listagem de profissionais com filtros
    router.push(`/profissionais?${params.toString()}`)
  }

  return (
    <section className="bg-[#f5f5f0] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex my-auto gap-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#353E5C] mb-2">Pesquisar</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Encontre profissionais e empresas por localização, especialidade ou categoria
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 uppercase">
            {/* Cidade */}
            <div className="flex-1 relative">
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="uppercase border-2">Cidade</option>
                {cidades.map((c) => (
                  <option key={c} value={c} className="uppercase border-2">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#928575] pointer-events-none" />
            </div>

            {/* Profissional / Empresa */}
            <div className="flex-1 relative">
              <select
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Profissional / Empresa</option>
                {profissionais.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} {p.title && `- ${p.title}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#928575] pointer-events-none" />
            </div>

            {/* Especialidade */}
            <div className="flex-1 relative">
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Especialidade</option>
                {especialidades.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#928575] pointer-events-none" />
            </div>

            {/* Tema */}
            <div className="flex-1 relative">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl uppercase appearance-none bg-white text-[#928575] outline-none ring-2 ring-[#928575] border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Tema</option>
                {temas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#928575] pointer-events-none" />
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


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  title: string
  specialty: string
  city: string
  state: string
}

export function ProfessionalSearchBar() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
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
        // Buscar todos os profissionais ativos
        const [professionalsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/professionals?per_page=1000&active=true`),
          fetch(`${API_URL}/categories`)
        ])

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          const professionals = data.professionals || []
          
          setProfessionais(professionals)

          // Extrair cidades únicas
          const cidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.city)
              .map((p: Professional) => p.city)
          )].sort()
          setCidades(cidadesUnicas)

          // Extrair especialidades únicas
          const especialidadesUnicas = [...new Set(
            professionals
              .filter((p: Professional) => p.specialty)
              .map((p: Professional) => p.specialty)
          )].sort()
          setEspecialidades(especialidadesUnicas)
        }

        // Buscar categorias (temas)
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const categoryNames = (categoriesData.categories || [])
            .map((cat: any) => cat.name)
            .sort()
          setTemas(categoryNames)
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
    
    if (searchTerm) params.append("search", searchTerm)
    if (cidade) params.append("city", cidade)
    if (profissional) params.append("name", profissional)
    if (especialidade) params.append("specialty", especialidade)
    if (tema) params.append("category", tema)

    // Redirecionar para página de listagem de profissionais com filtros
    router.push(`/profissionais?${params.toString()}`)
  }

  return (
    <section className="border-b border-[#E2DED2] bg-[#F6F4ED]">
      <div className="max-w-7xl mx-auto py-4 px-4 md:px-6 space-y-3">
        <p className="text-lg font-semibold uppercase tracking-[0.05em]">
          Pesquisar
        </p>
        <p className="text-sm text-gray-600">
          Encontre profissionais e empresas por nome, localização ou especialidade
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Campo de busca principal */}
          <div className="md:flex-1">
            <input
              type="text"
              placeholder="Procure por nome do profissional, clínica ou palavra-chave"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#126861]"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:flex-[2]">
            {/* Cidade */}
            <div className="relative">
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#126861] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Cidade</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Profissional/Empresa */}
            <div className="relative">
              <select
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#126861] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Profissional / Empresa</option>
                {profissionais.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} {p.title && `- ${p.title}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Especialidade */}
            <div className="relative">
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#126861] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Especialidade</option>
                {especialidades.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Tema */}
            <div className="relative">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#126861] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Tema</option>
                {temas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Botão de busca */}
          <Button 
            type="submit" 
            className="bg-[#126861] hover:bg-[#0f5650] text-white px-8 h-12 flex items-center gap-2"
            disabled={isLoading}
          >
            <Search size={18} />
            BUSCAR
          </Button>
        </form>
      </div>
    </section>
  )
}


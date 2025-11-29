"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Phone, Mail } from "lucide-react"
import { MainSearchBar } from "@/components/blog/main-search-bar"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

interface Professional {
  id: string
  name: string
  slug: string
  title: string
  specialty: string
  bio: string
  avatar?: string
  cover_image?: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  working_hours?: string
  active: boolean
  featured: boolean
}

export default function ProfessionalsPage() {
  const searchParams = useSearchParams()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  })

  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true)
      try {
        // Construir query params da URL
        const params = new URLSearchParams()
        params.append("page", "1")
        params.append("per_page", "12")
        params.append("active", "true")

        // Adicionar filtros da busca
        const search = searchParams.get("search")
        const city = searchParams.get("city")
        const name = searchParams.get("name")
        const specialty = searchParams.get("specialty")

        if (search) params.append("search", search)
        if (city) params.append("city", city)
        if (name) params.append("search", name) // Buscar por nome usando o campo search
        if (specialty) params.append("specialty", specialty)

        const response = await fetch(`${API_URL}/professionals?${params.toString()}`)

        if (response.ok) {
          const data = await response.json()
          setProfessionals(data.professionals || [])
          setMeta(data.meta || meta)
        }
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessionals()
  }, [searchParams])

  return (
    <div className="flex flex-col bg-white pt-24">
      {/* Barra de busca */}
      <MainSearchBar />

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Profissionais e Empresas
          </h1>
          <p className="text-gray-600">
            {isLoading ? (
              "Carregando profissionais..."
            ) : (
              `${meta.total} ${meta.total === 1 ? "profissional encontrado" : "profissionais encontrados"}`
            )}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#126861]" />
          </div>
        )}

        {/* Grid de profissionais */}
        {!isLoading && professionals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Link
                key={professional.id}
                href={`/profissional/${professional.slug}`}
                className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100">
                  {professional.cover_image || professional.avatar ? (
                    <Image
                      src={professional.cover_image || professional.avatar || ""}
                      alt={professional.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">{professional.name.charAt(0)}</span>
                    </div>
                  )}
                  {professional.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        ⭐ Destaque
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-3">
                  {/* Nome e título */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#126861] transition-colors mb-1">
                      {professional.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#928575]">
                      {professional.title}
                    </p>
                  </div>

                  {/* Especialidade */}
                  <Badge className="bg-[#126861] hover:bg-[#0f5650] text-white">
                    {professional.specialty}
                  </Badge>

                  {/* Bio (preview) */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {professional.bio}
                  </p>

                  {/* Informações de contato */}
                  <div className="space-y-1 text-xs text-gray-500 border-t pt-3">
                    {professional.city && professional.state && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#126861]" />
                        <span>{professional.city}, {professional.state}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#126861]" />
                      <span>{professional.phone}</span>
                    </div>
                  </div>

                  {/* Botão */}
                  <Button
                    className="w-full bg-[#126861] hover:bg-[#0f5650] text-white mt-4"
                    size="sm"
                  >
                    Ver Perfil Completo
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Nenhum resultado */}
        {!isLoading && professionals.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum profissional encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar seus filtros de busca para encontrar mais resultados.
            </p>
            <Button
              onClick={() => window.location.href = "/profissionais"}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Paginação (se necessário) */}
        {!isLoading && meta.total_pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === meta.page ? "default" : "outline"}
                  size="sm"
                  className={page === meta.page ? "bg-[#126861]" : ""}
                  onClick={() => {
                    // Implementar mudança de página
                    console.log("Página:", page)
                  }}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


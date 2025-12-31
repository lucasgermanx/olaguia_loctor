"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Phone, Mail } from "lucide-react"
import { MainSearchBar } from "@/components/blog/main-search-bar"
import { BlogSidebarNew } from "@/components/blog/blog-sidebar-new"
import { SocialShare } from "@/components/blog/social-share"

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
  register?: string
  active: boolean
  featured: boolean
  additional_cities?: { city: string; state: string }[]
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    whatsapp?: string
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
  tags?: {
    tag: {
      name: string
      slug: string
    }
  }[]
}

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
async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      return { categories: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

async function getTags() {
  try {
    const res = await fetch(`${API_URL}/tags`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch tags: ${res.status} ${res.statusText}`);
      return { tags: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { tags: [] };
  }
}

function ProfessionalsPageContent() {
  const searchParams = useSearchParams()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [professionalPosts, setProfessionalPosts] = useState<Record<string, Post[]>>({})
  const [allProfessionalPosts, setAllProfessionalPosts] = useState<Record<string, Post[]>>({})
  const [showAllPosts, setShowAllPosts] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  })
  let categories: Category[] = []
  let tags: Tag[] = []

  // Extrair nome base do slug (removendo o último segmento após o último hífen)
  const getBaseSlug = (slug: string): string => {
    let baseSlug = slug.toLowerCase().trim()

    // Encontra o último hífen
    const lastHyphenIndex = baseSlug.lastIndexOf('-')

    // Se houver hífen, remove tudo após ele (incluindo o hífen)
    if (lastHyphenIndex > 0) {
      baseSlug = baseSlug.substring(0, lastHyphenIndex)
    }

    return baseSlug.trim()
  }

  // Extrair nome base do nome (removendo sufixos como " - SP", " - RJ")
  const getBaseName = (name: string): string => {
    // Remove padrões como " - SP", " - RJ", " - MG", etc.
    const patterns = [
      /\s*-\s*[A-Z]{2}$/, // " - SP", " - RJ"
      /\s*\([^)]*\)$/,     // "(São Paulo)", "(Rio de Janeiro)"
    ]

    let baseName = name.trim()
    patterns.forEach(pattern => {
      baseName = baseName.replace(pattern, '')
    })

    return baseName.trim()
  }

  // Encontrar todos os profissionais relacionados (mesmo nome base no slug ou nome)
  const findRelatedProfessionals = (currentProfessional: Professional, allProfessionals: Professional[]): Professional[] => {
    const baseSlug = getBaseSlug(currentProfessional.slug)
    const baseName = getBaseName(currentProfessional.name)

    return allProfessionals.filter(prof => {
      if (prof.id === currentProfessional.id) return false

      // Verifica se o slug base é igual (prioridade)
      const profBaseSlug = getBaseSlug(prof.slug)
      if (profBaseSlug === baseSlug) return true

      // Verifica se o nome base é igual (fallback)
      const profBaseName = getBaseName(prof.name)
      if (profBaseName === baseName && baseName.length > 0) return true

      return false
    })
  }

  // Buscar posts de um profissional e seus relacionados com filtros de busca
  const fetchProfessionalPosts = async (
    professionalId: string,
    currentProfessional: Professional,
    allProfessionals: Professional[],
    filters?: { city?: string | null, specialty?: string | null, tag?: string | null }
  ) => {
    try {
      // Encontrar profissionais relacionados (mesmo nome base)
      const relatedProfessionals = findRelatedProfessionals(currentProfessional, allProfessionals)
      const allRelatedIds = [professionalId, ...relatedProfessionals.map(p => p.id)]



      // Buscar posts de TODOS os profissionais relacionados
      const allPostsPromises = allRelatedIds.map(async (profId) => {
        const params = new URLSearchParams()
        params.append("professional", profId)
        params.append("per_page", "50")
        params.append("published", "true")

        const res = await fetch(`${API_URL}/posts?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          return data.posts || []
        }
        return []
      })

      const allPostsArrays = await Promise.all(allPostsPromises)

      // Combinar todos os posts e remover duplicatas (por ID)
      const postsMap = new Map<string, Post>()
      allPostsArrays.flat().forEach((post: Post) => {
        if (!postsMap.has(post.id)) {
          postsMap.set(post.id, post)
        }
      })

      const allPosts = Array.from(postsMap.values())

      // Armazenar todos os posts para TODOS os profissionais relacionados
      // Isso garante que os posts apareçam em todos os cadastros
      setAllProfessionalPosts(prev => {
        const updated = { ...prev }
        allRelatedIds.forEach(id => {
          updated[id] = allPosts
        })
        return updated
      })

      // Se houver filtros, filtrar os posts
      let filteredPosts = allPosts

      if (filters?.specialty) {
        // Filtrar por especialidade: verificar se a categoria ou título contém a especialidade
        filteredPosts = allPosts.filter((post: Post) => {
          const specialtyLower = filters.specialty!.toLowerCase()
          const categoryMatch = post.category?.name?.toLowerCase().includes(specialtyLower)
          const titleMatch = post.title?.toLowerCase().includes(specialtyLower)
          const excerptMatch = post.excerpt?.toLowerCase().includes(specialtyLower)

          return categoryMatch || titleMatch || excerptMatch
        })

        // Se não encontrou posts filtrados, mostrar todos
        if (filteredPosts.length === 0) {
          filteredPosts = allPosts
        }
      }

      // Filtrar por tag se especificada
      if (filters?.tag) {
        const tagLower = filters.tag.toLowerCase()
        filteredPosts = filteredPosts.filter((post: Post) => {
          // Verificar se o post tem a tag selecionada (estrutura: tags[].tag.name)
          const hasTag = post.tags?.some(t =>
            (t?.tag?.name?.toLowerCase() === tagLower) || (t?.tag?.slug?.toLowerCase() === tagLower)
          )
          return hasTag
        })
      }

      // Ordenar por relevância (posts que correspondem aos filtros primeiro)
      if (filters?.specialty && filteredPosts.length > 0) {
        filteredPosts = filteredPosts.sort((a: Post, b: Post) => {
          const specialtyLower = filters.specialty!.toLowerCase()
          const aCategoryMatch = a.category?.name?.toLowerCase().includes(specialtyLower)
          const bCategoryMatch = b.category?.name?.toLowerCase().includes(specialtyLower)
          const aTitleMatch = a.title?.toLowerCase().includes(specialtyLower)
          const bTitleMatch = b.title?.toLowerCase().includes(specialtyLower)

          // Priorizar: categoria match > título match > outros
          const aScore = (aCategoryMatch ? 2 : 0) + (aTitleMatch ? 1 : 0)
          const bScore = (bCategoryMatch ? 2 : 0) + (bTitleMatch ? 1 : 0)

          return bScore - aScore
        })
      }

      // Limitar a 3 posts para exibição inicial
      const displayPosts = filteredPosts.slice(0, 3)

      // Armazenar posts filtrados para TODOS os profissionais relacionados
      setProfessionalPosts(prev => {
        const updated = { ...prev }
        allRelatedIds.forEach(id => {
          updated[id] = displayPosts
        })
        return updated
      })
    } catch (error) {
      console.error("Erro ao buscar posts do profissional:", error)
    }
  }

  // Toggle para mostrar todos os posts ou apenas os filtrados
  const toggleShowAllPosts = (professionalId: string) => {
    setShowAllPosts(prev => ({
      ...prev,
      [professionalId]: !prev[professionalId]
    }))
  }

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
        const specialty = searchParams.get("specialty") // Profissão (title no banco)
        const tag = searchParams.get("tag") // Tag/Tema dos posts

        if (search) params.append("search", search)
        if (city) params.append("city", city)
        if (name) params.append("search", name) // Buscar por nome usando o campo search
        if (specialty) params.append("specialty", specialty) // specialty busca pelo campo title no backend

        // Se tem filtro de tag, buscar posts com essa tag primeiro
        let professionalIdsWithTag: string[] = []
        if (tag) {
          try {
            const postsWithTagRes = await fetch(`${API_URL}/posts?tag=${encodeURIComponent(tag)}&per_page=100&published=true`)
            if (postsWithTagRes.ok) {
              const postsData = await postsWithTagRes.json()
              const posts = postsData.posts || []
              // Extrair IDs únicos dos profissionais que têm posts com essa tag
              professionalIdsWithTag = [...new Set(
                posts
                  .filter((p: any) => p.professional_id)
                  .map((p: any) => p.professional_id)
              )] as string[]
            }
          } catch (error) {
            console.error("Erro ao buscar posts por tag:", error)
          }
        }

        const response = await fetch(`${API_URL}/professionals?${params.toString()}`)

        if (response.ok) {
          const data = await response.json()
          let filteredProfs = data.professionals || []

          // Se tem filtro de tag, filtrar apenas profissionais que têm posts com essa tag
          if (tag && professionalIdsWithTag.length > 0) {
            filteredProfs = filteredProfs.filter((prof: Professional) =>
              professionalIdsWithTag.includes(prof.id)
            )
          } else if (tag && professionalIdsWithTag.length === 0) {
            // Se tem filtro de tag mas nenhum profissional tem posts com essa tag
            filteredProfs = []
          }

          // Buscar TODOS os profissionais ativos para encontrar relacionados
          // (mesmo que não estejam na cidade pesquisada)
          const allProfsParams = new URLSearchParams()
          allProfsParams.append("page", "1")
          allProfsParams.append("per_page", "100") // Limite máximo da API
          allProfsParams.append("active", "true")

          const allProfsResponse = await fetch(`${API_URL}/professionals?${allProfsParams.toString()}`)
          let allProfessionals: Professional[] = filteredProfs

          if (allProfsResponse.ok) {
            const allProfsData = await allProfsResponse.json()
            allProfessionals = allProfsData.professionals || []
          }

          // Exibir apenas os profissionais filtrados (da cidade pesquisada ou com posts da tag)
          // Mas buscar posts de todos os relacionados
          setProfessionals(filteredProfs)
          setMeta(data.meta ? { ...data.meta, total: filteredProfs.length } : meta)

          // Buscar posts de cada profissional com os filtros aplicados
          // Usar allProfessionals para encontrar os relacionados (para buscar posts de todos)
          const currentFilters = {
            city: searchParams.get("city"),
            specialty: searchParams.get("specialty"),
            tag: tag
          }

          // Para cada profissional filtrado, buscar posts (incluindo dos relacionados)
          filteredProfs.forEach((prof: Professional) => {
            // Passa allProfessionals para que a função encontre os relacionados
            fetchProfessionalPosts(prof.id, prof, allProfessionals, currentFilters)
          })
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
    <div className="flex flex-col bg-white">
      <div className="hidden md:block ">
        <MainSearchBar />
      </div>
      <div className="py-10 flex flex-col lg:flex-row gap-8 w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto">
        {/* Conteúdo principal */}
        <div className=" lg:w-3/4">
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

          {/* Lista de profissionais com posts */}
          {!isLoading && professionals.length > 0 && (
            <div className="space-y-12">
              {professionals.map((professional) => {
                const posts = professionalPosts[professional.id] || []

                console.log({ additional_cities: professional.additional_cities })

                // Componente para renderizar card do profissional
                const ProfessionalCard = ({ prof }: { prof: Professional }) => (
                  <Link
                    href={`/profissional/${prof.slug}`}
                    className="group block"
                  >
                    <div className="border border-gray-200">
                      <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                        {prof.avatar ? (
                          <Image
                            src={prof.avatar}
                            alt={prof.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">{prof.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 pb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{prof.name}</h3>
                        {prof.register && (
                          <p className="text-sm text-gray-600 font-semibold line-clamp-4 mb-1">{prof.register}</p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-4 mb-2">{prof.title}</p>

                        <div className="h-[1px] w-full bg-gray-200 my-2" />
                        <p className="text-sm text-gray-700 line-clamp-4 mb-2">{prof.city}, {prof.state}</p>
                        {prof.additional_cities && prof.additional_cities.length > 0 && (
                          <>
                           {prof.additional_cities.map((city: any) => {
                            return (
                              <p key={city.id} className="text-sm text-gray-700 line-clamp-4 mb-1">{city.city}, {city.state}</p>
                            )
                           })}
                          </>
                        )}
                        <Button
                          className="w-full bg-[#126861] hover:bg-[#0f5650] text-white mt-4"
                          size="sm"
                        >
                          Ver Perfil Completo
                        </Button>
                      </div>
                    </div>
                  </Link>
                )

                return (
                  <div key={professional.id} className="border-b border-gray-200 pb-12">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Card do Profissional - Esquerda */}
                      <div className="md:w-72 md:order-1">
                        <ProfessionalCard prof={professional} />
                      </div>

                      {/* Posts do Profissional - Direita */}
                      <div className="flex-1 md:order-2 border-l border-gray-200 h-full pl-5">
                        {(() => {
                          const allPosts = allProfessionalPosts[professional.id] || []
                          const filteredPosts = professionalPosts[professional.id] || []
                          const hasFilters = searchParams.get("city") || searchParams.get("specialty") || searchParams.get("tag")
                          const isShowingAll = showAllPosts[professional.id]
                          const displayPosts = isShowingAll ? allPosts : filteredPosts
                          const hasMorePosts = allPosts.length > filteredPosts.length

                          // Posts são buscados de todos os cadastros relacionados
                          const hasSharedPosts = allPosts.length > 0

                          return displayPosts.length > 0 ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    Artigos publicados:
                                    {hasFilters && !isShowingAll && filteredPosts.length < allPosts.length && (
                                      <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({filteredPosts.length} de {allPosts.length} relacionados)
                                      </span>
                                    )}
                                  </h4>
                                </div>
                                {hasFilters && hasMorePosts && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      toggleShowAllPosts(professional.id)
                                    }}
                                    className="text-[#126861] hover:text-[#0f5650] text-xs"
                                  >
                                    {isShowingAll ? "Mostrar apenas relacionados" : `Ver todos (${allPosts.length})`}
                                  </Button>
                                )}
                              </div>
                              {displayPosts.map((post) => (
                                <Link
                                  key={post.id}
                                  href={`/blog/${post.slug}`}
                                  className="flex gap-2 group border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                  {/* Imagem do post */}
                                  <div className="relative w-32 md:w-40 flex-shrink-0 bg-gray-100">
                                    {post.featured_image ? (
                                      <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200" />
                                    )}
                                  </div>

                                  {/* Conteúdo do post */}
                                  <div className="flex-1 p-4 flex flex-col justify-center">
                                    {/* Badge de categoria */}
                                    {post.category && (
                                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] w-fit rounded-sm text-white mb-2 text-[10px] border-none uppercase">
                                        {post.category?.name || "CATEGORIA"}
                                      </Badge>
                                    )}
                                    <h3 className="font-open-sans font-semibold text-base sm:text-lg/6 mb-1 text-gray-900 uppercase line-clamp-2">
                                      {post.title}
                                    </h3>
                                    {post.excerpt && (
                                      <p className="text-xs sm:text-base font-open-sans font-medium text-gray-600 mb-2 line-clamp-2">
                                        {post.excerpt}
                                      </p>
                                    )}
                                    <span className="font-lato text-[10px] w-fit italic text-gray-500 border border-gray-300 mt-2 px-2 py-1 uppercase">
                                      LEIA MAIS
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                              Nenhum artigo publicado ainda
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )
              })}
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

        <div className="w-full lg:w-1/4 hidden md:block sticky top-20">
          <BlogSidebarNew categories={categories || []} tags={tags || []} />
        </div>
      </div>

      {/* Compartilhe */}
      <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto px-4 mb-8">
        <SocialShare title="Profissionais - OLÁ Guia" />
      </div>
    </div>
  )
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center pt-24">Carregando...</div>}>
      <ProfessionalsPageContent />
    </Suspense>
  )
}

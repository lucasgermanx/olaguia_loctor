"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Plus, Search, Trash2, CheckCircle, XCircle, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  published_at: string | null
  created_at: string
  category: {
    id: string
    name: string
  }
  author: {
    id: string
    name: string
  }
  professional?: {
    id: string
    name: string
    title: string
  }
}

interface Category {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  role?: string
}

interface Professional {
  id: string
  name: string
  title: string
}

interface AuthorOption {
  id: string
  name: string
  type: 'user' | 'professional'
  subtitle?: string
}

interface PostsResponse {
  posts: Post[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<AuthorOption[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const fetchPosts = async (page = 1, search = "", categoryId = "", authorId = "", status = "") => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const searchParams = new URLSearchParams({
        page: page.toString(),
        per_page: "10",
      })

      if (search) {
        searchParams.append("search", search)
      }

      if (categoryId && categoryId !== "all") {
        searchParams.append("category_id", categoryId)
      }

      if (authorId && authorId !== "all") {
        // Verificar se é usuário ou profissional
        if (authorId.startsWith("user-")) {
          const userId = authorId.replace("user-", "")
          searchParams.append("author", userId)
        } else if (authorId.startsWith("professional-")) {
          const professionalId = authorId.replace("professional-", "")
          searchParams.append("professional", professionalId)
        }
      }

      if (status && status !== "all") {
        searchParams.append("published", status)
        console.log("📊 Enviando status:", status, "Tipo:", typeof status)
      }

      console.log("🔍 URL de busca:", `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/posts?${searchParams.toString()}`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/posts?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data: PostsResponse = await response.json()
        setPosts(data.posts)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const [categoriesRes, usersRes, professionalsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/admin/users?per_page=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals?per_page=100`),
        ])

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data.categories || [])
        }

        // Combinar usuários e profissionais
        const authorsList: AuthorOption[] = []

        if (usersRes.ok) {
          const data = await usersRes.json()
          const users = (data.users || []).map((user: User) => ({
            id: `user-${user.id}`,
            name: user.name,
            type: 'user' as const,
            subtitle: 'Usuário',
          }))
          authorsList.push(...users)
        }

        if (professionalsRes.ok) {
          const data = await professionalsRes.json()
          const professionals = (data.professionals || []).map((prof: Professional) => ({
            id: `professional-${prof.id}`,
            name: prof.name,
            type: 'professional' as const,
            subtitle: prof.title,
          }))
          authorsList.push(...professionals)
        }

        // Ordenar por nome
        authorsList.sort((a, b) => a.name.localeCompare(b.name))
        setAuthors(authorsList)
      } catch (error) {
        console.error("Error fetching filters data:", error)
      }
    }

    fetchFiltersData()
    fetchPosts()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPosts(1, searchTerm, selectedCategory, selectedAuthor, selectedStatus)
  }

  const handlePageChange = (page: number) => {
    fetchPosts(page, searchTerm, selectedCategory, selectedAuthor, selectedStatus)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedAuthor("all")
    setSelectedStatus("all")
    fetchPosts(1, "", "all", "all", "all")
  }

  const hasActiveFilters = searchTerm || (selectedCategory !== "all") || (selectedAuthor !== "all") || (selectedStatus !== "all")

  const handleDeletePost = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Atualizar a lista de posts após a exclusão
        fetchPosts(meta.page, searchTerm, selectedCategory, selectedAuthor, selectedStatus)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Posts</h1>
          <Button asChild className="bg-navy-950 hover:bg-navy-900">
            <Link href="/admin/posts/new">
              <Plus size={16} className="mr-2" />
              Novo Post
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter size={20} />
              Filtros de Busca
            </h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} className="mr-1" />
                  Limpar Filtros
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Campo de busca por texto */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por título ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-navy-950 hover:bg-navy-900">
                <Search size={16} className="mr-2" />
                Buscar
              </Button>
            </div>

            {/* Filtros avançados */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                {/* Filtro por Categoria */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Autor */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Autor / Empresa</label>
                  <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os autores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os autores</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          <div className="flex flex-col">
                            <span>{author.name}</span>
                            {author.subtitle && (
                              <span className="text-xs text-gray-500">{author.subtitle}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Status */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="true">Publicado</SelectItem>
                      <SelectItem value="false">Rascunho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Badge de filtros ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Categoria: {categories.find((c) => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedAuthor !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Autor: {authors.find((a) => a.id === selectedAuthor)?.name}
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {selectedStatus === "true" ? "Publicado" : "Rascunho"}
                  </Badge>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-navy-950 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => {
                    // Determinar qual autor exibir (profissional tem prioridade)
                    const displayAuthor = post.professional
                      ? `${post.professional.name} (${post.professional.title})`
                      : post.author?.name || "Desconhecido"

                    return (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.category?.name || "Sem categoria"}</TableCell>
                        <TableCell>{displayAuthor}</TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <CheckCircle size={14} className="mr-1" />
                              Publicado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              <XCircle size={14} className="mr-1" />
                              Rascunho
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild size="icon" variant="outline">
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye size={16} />
                              </Link>
                            </Button>
                            <Button asChild size="icon" variant="outline">
                              <Link href={`/admin/posts/edit/${post.id}`}>
                                <Edit size={16} />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="outline" className="text-red-500 hover:text-red-700">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o post "{post.title}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Paginação */}
              {meta.total_pages > 1 && (
                <div className="flex justify-center py-4">
                  <div className="flex gap-1">
                    {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === meta.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={page === meta.page ? "bg-navy-950" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum post encontrado</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

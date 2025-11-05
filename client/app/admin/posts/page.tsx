"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Plus, Search, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    name: string
  }
  author: {
    name: string
  }
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
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPosts = async (page = 1, search = "") => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/posts?${searchParams.toString()}`, {
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
    fetchPosts()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPosts(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    fetchPosts(page, searchTerm)
  }

  const handleDeletePost = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Atualizar a lista de posts após a exclusão
        fetchPosts(meta.page, searchTerm)
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
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" variant="outline">
              <Search size={16} className="mr-2" />
              Buscar
            </Button>
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
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category?.name || "Sem categoria"}</TableCell>
                      <TableCell>{post.author?.name || "Desconhecido"}</TableCell>
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
                  ))}
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

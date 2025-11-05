"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Search, Trash2, Tag } from "lucide-react"
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

interface TagItem {
  id: string
  name: string
  slug: string
  color?: string
  created_at: string
  _count?: {
    posts: number
  }
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTags = async (search = "") => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const searchParams = new URLSearchParams()
      if (search) {
        searchParams.append("search", search)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/tags?${searchParams.toString()}`,
      )

      if (response.ok) {
        const data = await response.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTags(searchTerm)
  }

  const handleDeleteTag = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/tags/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchTags(searchTerm)
      }
    } catch (error) {
      console.error("Error deleting tag:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Tags</h1>
          <Button asChild className="bg-navy-950 hover:bg-navy-900">
            <Link href="/admin/tags/new">
              <Plus size={16} className="mr-2" />
              Nova Tag
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar tags..."
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
              <p className="mt-4 text-gray-500">Carregando tags...</p>
            </div>
          ) : tags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-gray-400 mr-2" />
                        {tag.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{tag.slug}</TableCell>
                    <TableCell>
                      {tag.color ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: tag.color }} />
                          <Badge variant="outline" style={{ color: tag.color }}>
                            {tag.color}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sem cor</span>
                      )}
                    </TableCell>
                    <TableCell>{tag._count?.posts || 0}</TableCell>
                    <TableCell>{new Date(tag.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="icon" variant="outline">
                          <Link href={`/admin/tags/edit/${tag.id}`}>
                            <Edit size={16} />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-red-500 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Tag</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a tag "{tag.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTag(tag.id)}
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
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhuma tag encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Search, Trash2, Folder } from "lucide-react"
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

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  _count?: {
    posts: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCategories = async (search = "") => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const searchParams = new URLSearchParams()
      if (search) {
        searchParams.append("search", search)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/categories?${searchParams.toString()}`,
      )

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCategories(searchTerm)
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchCategories(searchTerm)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
          <Button asChild className="bg-navy-950 hover:bg-navy-900">
            <Link href="/admin/categories/new">
              <Plus size={16} className="mr-2" />
              Nova Categoria
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar categorias..."
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
              <p className="mt-4 text-gray-500">Carregando categorias...</p>
            </div>
          ) : categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 text-gray-400 mr-2" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "Sem descrição"}</TableCell>
                    <TableCell>{category._count?.posts || 0}</TableCell>
                    <TableCell>{new Date(category.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="icon" variant="outline">
                          <Link href={`/admin/categories/edit/${category.id}`}>
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
                              <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a categoria "{category.name}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id)}
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
              <p className="text-gray-500">Nenhuma categoria encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

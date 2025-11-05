"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Search, Trash2, UserCircle } from "lucide-react"
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

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MEMBER"
  created_at: string
}

interface UsersResponse {
  users: User[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsers = async (page = 1, search = "") => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/admin/users?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data: UsersResponse = await response.json()
        setUsers(data.users)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    fetchUsers(page, searchTerm)
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Atualizar a lista de usuários após a exclusão
        fetchUsers(meta.page, searchTerm)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <Button asChild className="bg-navy-950 hover:bg-navy-900">
            <Link href="/admin/users/new">
              <Plus size={16} className="mr-2" />
              Novo Usuário
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar usuários..."
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
              <p className="mt-4 text-gray-500">Carregando usuários...</p>
            </div>
          ) : users.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                          {user.role === "ADMIN" ? "Admin" : "Membro"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="icon" variant="outline">
                            <Link href={`/admin/users/edit/${user.id}`}>
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
                                <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
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
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

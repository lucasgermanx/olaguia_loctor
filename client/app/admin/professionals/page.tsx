"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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

interface Professional {
  id: string
  name: string
  slug: string
  title: string
  specialty: string
  avatar?: string
  email: string
  phone: string
  city?: string
  state?: string
  active: boolean
  featured: boolean
  created_at: string
}

interface ProfessionalsResponse {
  professionals: Professional[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [meta, setMeta] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchProfessionals = async (page = 1, search = "") => {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data: ProfessionalsResponse = await response.json()
        setProfessionals(data.professionals)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error("Error fetching professionals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProfessionals(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    fetchProfessionals(page, searchTerm)
  }

  const handleDeleteProfessional = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals/id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        fetchProfessionals(meta.page, searchTerm)
      }
    } catch (error) {
      console.error("Error deleting professional:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Profissionais</h1>
          <Button asChild className="bg-[#126861] hover:bg-[#0f5650]">
            <Link href="/admin/professionals/new">
              <Plus size={16} className="mr-2" />
              Novo Profissional
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar profissionais por nome, especialidade ou cidade..."
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
              <div className="animate-spin h-8 w-8 border-4 border-[#126861] border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando profissionais...</p>
            </div>
          ) : professionals.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Título/Especialidade</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            {professional.avatar ? (
                              <Image
                                src={professional.avatar}
                                alt={professional.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {professional.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{professional.name}</div>
                            <div className="text-sm text-gray-500">{professional.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{professional.title}</div>
                          <div className="text-sm text-gray-500">{professional.specialty}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {professional.city && professional.state ? (
                          <span>
                            {professional.city}, {professional.state}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{professional.phone}</div>
                          <div className="text-gray-500">{professional.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {professional.active ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 w-fit">
                              <CheckCircle size={14} className="mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 w-fit">
                              <XCircle size={14} className="mr-1" />
                              Inativo
                            </Badge>
                          )}
                          {professional.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 w-fit">
                              ⭐ Destaque
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="icon" variant="outline">
                            <Link href={`/profissional/${professional.slug}`} target="_blank">
                              <Eye size={16} />
                            </Link>
                          </Button>
                          <Button asChild size="icon" variant="outline">
                            <Link href={`/admin/professionals/edit/${professional.id}`}>
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
                                <AlertDialogTitle>Excluir Profissional</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{professional.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProfessional(professional.id)}
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
                        className={page === meta.page ? "bg-[#126861]" : ""}
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
              <p className="text-gray-500 mb-4">Nenhum profissional encontrado</p>
              <Button asChild>
                <Link href="/admin/professionals/new">
                  <Plus size={16} className="mr-2" />
                  Adicionar Primeiro Profissional
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}


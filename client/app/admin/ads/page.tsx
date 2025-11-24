"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2, CheckCircle, XCircle } from "lucide-react"
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

interface Ad {
  id: string
  title: string
  image_url: string
  link_url: string
  position: string
  active: boolean
  order: number
  created_at: string
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAds = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAds(data.ads || [])
      }
    } catch (error) {
      console.error("Error fetching ads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  const handleDeleteAd = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/ads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchAds()
      }
    } catch (error) {
      console.error("Error deleting ad:", error)
    }
  }

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      HERO_BOTTOM: "Hero - Bottom",
      BUSINESS_BANNER_1: "Business Banner 1",
      NOSSA_SAUDE_RIGHT: "Nossa Saúde - Direita",
      SOBRE_RELACIONAMENTOS_MIDDLE: "Sobre Relacionamentos - Meio",
      PROMOTIONAL_BANNER_1: "Banner Promocional 1",
      EMPRESAS_NEGOCIOS_RIGHT: "Empresas & Negócios - Direita",
      RINDO_A_TOA_MIDDLE: "Rindo à Toa - Meio",
      BUILD_BUSINESS_BANNER: "Build Business Banner",
      GASTRONOMIA_BOTTOM: "Gastronomia - Bottom",
    }
    return labels[position] || position
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Anúncios</h1>
          <Button asChild className="bg-navy-950 hover:bg-navy-900">
            <Link href="/admin/ads/new">
              <Plus size={16} className="mr-2" />
              Novo Anúncio
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-navy-950 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando anúncios...</p>
            </div>
          ) : ads.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.title}</TableCell>
                      <TableCell>{getPositionLabel(ad.position)}</TableCell>
                      <TableCell>{ad.order}</TableCell>
                      <TableCell>
                        {ad.active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle size={14} className="mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <XCircle size={14} className="mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(ad.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="icon" variant="outline">
                            <Link href={`/admin/ads/edit/${ad.id}`}>
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
                                <AlertDialogTitle>Excluir Anúncio</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o anúncio "{ad.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAd(ad.id)}
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
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum anúncio encontrado</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}


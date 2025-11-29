"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy, Check, Search, Upload, Trash2 } from "lucide-react"
import Image from "next/image"
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

interface Upload {
    id: string
    filename: string
    originalName: string
    mimetype: string
    size: number
    url: string
    type: string
    created_at: string
}

export default function MediaLibraryPage() {
    const router = useRouter()
    const [uploads, setUploads] = useState<Upload[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isUploading, setIsUploading] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const perPage = 24

    useEffect(() => {
        fetchUploads()
    }, [currentPage])

    const fetchUploads = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/admin/login")
                return
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/uploads?page=${currentPage}&per_page=${perPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.ok) {
                const data = await response.json()
                setUploads(data.uploads)
                setTotalPages(data.meta.total_pages)
            }
        } catch (error) {
            console.error("Error fetching uploads:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/admin/login")
                return
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("type", "post")

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            )

            if (response.ok) {
                fetchUploads() // Recarregar lista
                e.target.value = "" // Limpar input
            }
        } catch (error) {
            console.error("Error uploading file:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const copyToClipboard = (url: string, id: string) => {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}${url}`
        navigator.clipboard.writeText(fullUrl)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDeleteUpload = async (uploadId: string) => {
        try {
            setDeletingId(uploadId)
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/admin/login")
                return
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/uploads/${uploadId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.ok) {
                fetchUploads() // Recarregar lista
            } else {
                console.error("Erro ao deletar mídia")
            }
        } catch (error) {
            console.error("Error deleting upload:", error)
        } finally {
            setDeletingId(null)
        }
    }

    const filteredUploads = uploads.filter((upload) =>
        upload.originalName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Banco de Imagens</h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie todas as imagens enviadas para o blog
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <label htmlFor="file-upload">
                            <Button disabled={isUploading} asChild>
                                <span className="cursor-pointer">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Fazer Upload
                                        </>
                                    )}
                                </span>
                            </Button>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nome do arquivo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredUploads.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? "Nenhuma imagem encontrada" : "Nenhuma imagem enviada"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery
                                    ? "Tente buscar com outro termo"
                                    : "Faça upload da primeira imagem para começar"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {filteredUploads.map((upload) => (
                                <Card key={upload.id} className="overflow-hidden group">
                                    <div className="relative aspect-square bg-gray-100">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}${upload.url}`}
                                            alt={upload.originalName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <p className="text-xs font-medium text-gray-900 truncate mb-1" title={upload.originalName}>
                                            {upload.originalName}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span>{formatFileSize(upload.size)}</span>
                                            <span>{formatDate(upload.created_at)}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => copyToClipboard(upload.url, upload.id)}
                                            >
                                                {copiedId === upload.id ? (
                                                    <>
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Copiado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3 w-3 mr-1" />
                                                        Copiar
                                                    </>
                                                )}
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-200 hover:bg-red-50 hover:text-red-700"
                                                        disabled={deletingId === upload.id}
                                                    >
                                                        {deletingId === upload.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja apagar esta imagem? Esta ação não pode ser desfeita.
                                                            <br />
                                                            <br />
                                                            <span className="font-semibold text-gray-900">{upload.originalName}</span>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteUpload(upload.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Apagar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Próxima
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    )
}


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function EditTagPage() {
  const router = useRouter()
  const params = useParams()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#3B82F6",
  })

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/tags/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setFormData({
            name: data.tag.name,
            slug: data.tag.slug,
            color: data.tag.color || "#3B82F6",
          })
        }
      } catch (error) {
        console.error("Error fetching tag:", error)
        setError("Erro ao carregar tag")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTag()
    }
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/tags/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar tag")
      }

      router.push("/admin/tags")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar a tag")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-navy-950 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editar Tag</h1>
          <Button onClick={() => router.push("/admin/tags")} variant="outline">
            Cancelar
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 max-w-xl">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nome da tag"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="slug-da-tag"
                  />
                  <p className="text-sm text-gray-500 mt-1">URL amigável para a tag.</p>
                </div>

                <div>
                  <Label htmlFor="color">Cor</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cor da tag para identificação visual.</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-navy-950 hover:bg-navy-900" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  )
}

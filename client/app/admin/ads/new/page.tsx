"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function NewAdPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    position: "",
    active: true,
    order: 0,
  })

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar anúncio")
      }

      router.push("/admin/ads")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o anúncio")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Novo Anúncio</h1>
          <Button onClick={() => router.push("/admin/ads")} variant="outline">
            Cancelar
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url">URL da Imagem</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://exemplo.com/imagem.jpg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="link_url">URL do Link (opcional)</Label>
                    <Input
                      id="link_url"
                      value={formData.link_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                      placeholder="https://exemplo.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Posição no Site</Label>
                    <Select value={formData.position} onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HERO_BOTTOM">Hero - Bottom</SelectItem>
                        <SelectItem value="BUSINESS_BANNER_1">Business Banner 1</SelectItem>
                        <SelectItem value="NOSSA_SAUDE_RIGHT">Nossa Saúde - Direita</SelectItem>
                        <SelectItem value="SOBRE_RELACIONAMENTOS_MIDDLE">Sobre Relacionamentos - Meio</SelectItem>
                        <SelectItem value="PROMOTIONAL_BANNER_1">Banner Promocional 1</SelectItem>
                        <SelectItem value="EMPRESAS_NEGOCIOS_RIGHT">Empresas & Negócios - Direita</SelectItem>
                        <SelectItem value="RINDO_A_TOA_MIDDLE">Rindo à Toa - Meio</SelectItem>
                        <SelectItem value="BUILD_BUSINESS_BANNER">Build Business Banner</SelectItem>
                        <SelectItem value="GASTRONOMIA_BOTTOM">Gastronomia - Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order">Ordem</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Ordem de exibição (menor = primeiro)</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Ativo</Label>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/ads")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-navy-950 hover:bg-navy-900" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Anúncio
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}


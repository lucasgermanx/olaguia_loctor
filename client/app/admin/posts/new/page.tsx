"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Importar o editor de texto rico dinamicamente para evitar erros de SSR
const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md flex items-center justify-center">Carregando editor...</div>,
})

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
    tag_ids: [] as string[],
    featured_image: "",
    published: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        // Buscar categorias e tags
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/tags`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (categoriesRes.ok && tagsRes.ok) {
          const categoriesData = await categoriesRes.json()
          const tagsData = await tagsRes.json()

          setCategories(categoriesData.categories)
          setTags(tagsData.tags)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Erro ao carregar dados. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }))
  }

  const handleTagChange = (tagId: string) => {
    setFormData((prev) => {
      const tagIds = [...prev.tag_ids]
      if (tagIds.includes(tagId)) {
        return { ...prev, tag_ids: tagIds.filter((id) => id !== tagId) }
      } else {
        return { ...prev, tag_ids: [...tagIds, tagId] }
      }
    })
  }

  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    setFormData((prev) => ({ ...prev, slug }))
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar post")
      }

      // Redirecionar para a lista de posts
      router.push("/admin/posts")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o post")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Novo Post</h1>
          <Button onClick={() => router.push("/admin/posts")} variant="outline">
            Cancelar
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="slug">Slug</Label>
                        <div className="flex gap-2">
                          <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required />
                          <Button type="button" variant="outline" onClick={generateSlug}>
                            Gerar
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Resumo</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor="content">Conteúdo</Label>
                  <div className="mt-2">
                    <RichTextEditor value={formData.content} onChange={handleContentChange} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Publicação</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publicar</Label>
                    <Switch id="published" checked={formData.published} onCheckedChange={handlePublishedChange} />
                  </div>
                  <div className="mt-6">
                    <Button type="submit" className="w-full bg-navy-950 hover:bg-navy-900" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Post
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="featured_image">URL da Imagem Destacada</Label>
                      <Input
                        id="featured_image"
                        name="featured_image"
                        value={formData.featured_image}
                        onChange={handleInputChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category_id} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="mt-2 space-y-2">
                        {tags.map((tag) => (
                          <div key={tag.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              checked={formData.tag_ids.includes(tag.id)}
                              onChange={() => handleTagChange(tag.id)}
                              className="mr-2"
                            />
                            <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

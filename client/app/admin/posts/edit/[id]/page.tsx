"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

interface Professional {
  id: string
  name: string
  title: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  professional_id?: string
  featured_image: string
  published: boolean
  theme?: string
  position?: string
  order?: number
  featured?: boolean
  tags: Array<{ tag_id: string }>
}

export default function EditPostPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
    tag_ids: [] as string[],
    professional_id: "",
    featured_image: "",
    published: false,
    theme: "",
    position: "",
    order: 0,
    featured: false,
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

        // Buscar post, categorias, tags e profissionais
        const [postRes, categoriesRes, tagsRes, professionalsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/posts/id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/tags`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/professionals?per_page=100`),
        ])

        if (!postRes.ok) {
          throw new Error("Post não encontrado")
        }

        const postData = await postRes.json()
        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()

        setCategories(categoriesData.categories)
        setTags(tagsData.tags)

        if (professionalsRes.ok) {
          const professionalsData = await professionalsRes.json()
          setProfessionals(professionalsData.professionals || [])
        }

        // Extrair IDs das tags do post
        const tagIds = postData.post.tags.map((t: { tag_id: string }) => t.tag_id)

        setFormData({
          title: postData.post.title,
          slug: postData.post.slug,
          excerpt: postData.post.excerpt || "",
          content: postData.post.content,
          category_id: postData.post.category_id,
          tag_ids: tagIds,
          professional_id: postData.post.professional_id || "",
          featured_image: postData.post.featured_image || "",
          published: postData.post.published,
          theme: postData.post.theme || "",
          position: postData.post.position || "MAIN",
          order: postData.post.order || 0,
          featured: postData.post.featured || false,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Erro ao carregar dados. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])

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

  const handleProfessionalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, professional_id: value === "none" ? "" : value }))
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

      // Preparar dados para enviar - converter tag_ids para tags
      const submitData = {
        ...formData,
        tags: formData.tag_ids,
        tag_ids: undefined, // Remover tag_ids
        professional_id: formData.professional_id || undefined, // Converter string vazia para undefined
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar post")
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
          <h1 className="text-3xl font-bold">Editar Post</h1>
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
                          Atualizar Post
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
                      <Label htmlFor="professional">Profissional / Empresa (Opcional)</Label>
                      <Select value={formData.professional_id || "none"} onValueChange={handleProfessionalChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {professionals.map((professional) => (
                            <SelectItem key={professional.id} value={professional.id}>
                              {professional.name} {professional.title && `- ${professional.title}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Vincule este post a um profissional ou empresa específica
                      </p>
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

              {/* <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Posicionamento na Home</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme">Tema/Seção</Label>
                      <Select value={formData.theme} onValueChange={(value) => setFormData((prev) => ({ ...prev, theme: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HERO">Hero (Carousel Principal)</SelectItem>
                          <SelectItem value="EM_DESTAQUE">Em Destaque</SelectItem>
                          <SelectItem value="PARA_REFLEXAO">Para Reflexão</SelectItem>
                          <SelectItem value="NOSSA_SAUDE">Nossa Saúde</SelectItem>
                          <SelectItem value="SOBRE_RELACIONAMENTOS">Sobre Relacionamentos</SelectItem>
                          <SelectItem value="EMPRESAS_NEGOCIOS">Empresas & Negócios</SelectItem>
                          <SelectItem value="ESTETICA_BELEZA">Estética & Beleza</SelectItem>
                          <SelectItem value="RINDO_A_TOA">Rindo à Toa</SelectItem>
                          <SelectItem value="QUEBRA_CUCA">Quebra Cuca</SelectItem>
                          <SelectItem value="GASTRONOMIA">Gastronomia</SelectItem>
                          <SelectItem value="SUPER_DICAS">Super Dicas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="position">Posição</Label>
                      <Select value={formData.position} onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a posição" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAIN">Principal (Grande)</SelectItem>
                          <SelectItem value="LEFT">Esquerda</SelectItem>
                          <SelectItem value="CENTER">Centro</SelectItem>
                          <SelectItem value="RIGHT">Direita</SelectItem>
                          <SelectItem value="SIDE">Lateral</SelectItem>
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
                      <p className="text-xs text-gray-500 mt-1">Ordem de exibição dentro da seção (menor = primeiro)</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Post em Destaque</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

"use client"

import { BlogAuthorCard } from "@/components/blog/blog-author-card"
import { BlogTagList } from "@/components/blog/blog-tag-list"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BlogSearchBar } from "@/components/blog/blog-search-bar"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { LuCirclePlay } from "react-icons/lu";
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle, Search, ChevronDown, ChevronUp, Volume2, Plus, Minus } from "lucide-react"
import { BlogSidebarNew } from "@/components/blog/blog-sidebar-new"
import { SocialShare } from "@/components/blog/social-share"
import { MainSearchBar } from "@/components/blog/main-search-bar"

// Definir a URL da API com fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1003';

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published_at?: string
  created_at: string
  category?: {
    name: string
    slug: string
  }
  author?: {
    id: string
    name: string
    avatar?: string
  }
  professional?: {
    id: string
    name: string
    title: string
    avatar?: string
    slug: string
  }
  tags?: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  featured_image?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [recentPosts, setRecentPosts] = useState<RelatedPost[]>([])
  const [servicePosts, setServicePosts] = useState<RelatedPost[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRevistaExpanded, setIsRevistaExpanded] = useState(true)
  const [fontSize, setFontSize] = useState(18) // Tamanho base da fonte em px
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentTime, setCurrentTime] = useState(0) // Tempo atual em segundos
  const [totalTime, setTotalTime] = useState(0) // Tempo total em segundos
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!slug) {
      setError("Slug não encontrado")
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Buscar post
        const postRes = await fetch(`${API_URL}/posts/slug/${slug}`, {
          cache: "no-store",
        })

        if (!postRes.ok) {
          throw new Error(`Failed to fetch post: ${postRes.status}`)
        }

        const postData = await postRes.json()
        setPost(postData.post)

        if (postData.post) {
          // Buscar posts relacionados (mesma categoria)
          const categorySlug = postData.post.category?.slug
          if (categorySlug) {
            const relatedRes = await fetch(`${API_URL}/posts?category=${categorySlug}&per_page=3`)
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json()
              setRelatedPosts(relatedData.posts?.filter((p: any) => p.id !== postData.post.id).slice(0, 3) || [])
            }
          }

          // Buscar posts recentes
          const recentRes = await fetch(`${API_URL}/posts?per_page=2`)
          if (recentRes.ok) {
            const recentData = await recentRes.json()
            setRecentPosts(recentData.posts?.filter((p: any) => p.id !== postData.post.id).slice(0, 2) || [])
          }

          // Buscar posts para serviços (últimos 3 posts)
          const servicesRes = await fetch(`${API_URL}/posts?per_page=3`)
          if (servicesRes.ok) {
            const servicesData = await servicesRes.json()
            setServicePosts(servicesData.posts?.filter((p: any) => p.id !== postData.post.id).slice(0, 3) || [])
          }
        }

        // Buscar categorias e tags
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/tags`),
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories || [])
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setTags(tagsData.tags || [])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Erro ao carregar o post")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Função para extrair texto do HTML (remover tags HTML)
  const extractTextFromHTML = (html: string): string => {
    if (typeof window === 'undefined') return ''
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  // Função para contar palavras no texto
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Função para calcular tempo total baseado em palavras e velocidade da fala
  // Speech Synthesis geralmente fala entre 150-180 palavras/minuto com rate 1.0
  // Usamos uma estimativa conservadora de 150 palavras/minuto para evitar subestimar
  const calculateTotalTime = (wordCount: number, rate: number = 1.0): number => {
    // Taxa base mais realista: 150 palavras por minuto com rate 1.0
    // Speech Synthesis tende a ser mais lento que leitura humana
    const baseWordsPerMinute = 130
    const wordsPerSecond = (baseWordsPerMinute * rate) / 60
    // Adiciona 20% de margem de segurança para garantir que não subestime
    return Math.ceil((wordCount / wordsPerSecond) * 1.2)
  }

  // Função para formatar tempo em MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calcula o tempo total quando o post é carregado
  // Usa a velocidade padrão (rate 1.0) para estimativa inicial
  useEffect(() => {
    if (post && post.content) {
      const text = extractTextFromHTML(post.content)
      const wordCount = countWords(text)
      const defaultRate = 1.0 // Velocidade padrão do Speech Synthesis
      const calculatedTotalTime = calculateTotalTime(wordCount, defaultRate)
      setTotalTime(calculatedTotalTime)
    }
  }, [post])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-white pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-4">{error || "O post que você está procurando não existe."}</p>
            <Link href="/blog" className="text-[#126861] hover:underline">
              Voltar para o blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Aqui você pode adicionar a lógica para enviar o email para newsletter
      // Por enquanto, apenas um alerta
      alert("Obrigado por se inscrever na nossa newsletter!")
      setNewsletterEmail("")
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Aqui você pode adicionar a lógica para enviar o formulário de contato
      // Por enquanto, apenas um alerta
      alert("Mensagem enviada com sucesso!")
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para ouvir o conteúdo
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta a funcionalidade de áudio.')
      return
    }

    if (!post?.content) {
      alert('Não há conteúdo para ouvir.')
      return
    }

    const text = extractTextFromHTML(post.content)
    if (!text.trim()) {
      alert('Não há conteúdo para ouvir.')
      return
    }

    const synth = window.speechSynthesis

    if (isSpeaking) {
      // Se já está falando, para
      synth.cancel()
      setIsSpeaking(false)
      setCurrentTime(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      // Calcula o tempo total baseado no número de palavras e velocidade da fala
      const wordCount = countWords(text)
      const speechRate = 1.0 // Velocidade da fala (pode ser ajustada)
      const calculatedTotalTime = calculateTotalTime(wordCount, speechRate)
      setTotalTime(calculatedTotalTime)
      setCurrentTime(0)

      // Inicia a fala
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'
      utterance.rate = speechRate // Velocidade da fala (1.0 = normal, 0.5 = lento, 2.0 = rápido)
      utterance.pitch = 1.0 // Tom normal
      utterance.volume = 1.0 // Volume máximo

      // Atualiza o tempo durante a reprodução baseado no tempo real
      const startTime = Date.now()

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        // O tempo atual é baseado no tempo real decorrido
        // Não limitamos ao calculatedTotalTime para permitir que continue além da estimativa
        setCurrentTime(elapsed)
        // Se o tempo real exceder a estimativa, atualizamos o totalTime dinamicamente
        if (elapsed > calculatedTotalTime) {
          setTotalTime(Math.ceil(elapsed))
        }
      }, 100) // Atualiza a cada 100ms

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        // Atualiza o tempo total com o tempo real decorrido
        const realElapsed = (Date.now() - startTime) / 1000
        setCurrentTime(realElapsed)
        setTotalTime(realElapsed) // Atualiza o tempo total com o tempo real
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setCurrentTime(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      synth.cancel() // Para evitar sobreposição
      synth.speak(utterance)
    }
  }

  // Função para aumentar fonte
  const handleIncreaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, 32)) // Máximo de 32px
  }

  // Função para diminuir fonte
  const handleDecreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, 12)) // Mínimo de 12px
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#126861]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-white pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-4">{error || "O post que você está procurando não existe."}</p>
            <Link href="/blog" className="text-[#126861] hover:underline">
              Voltar para o blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Determinar qual autor exibir (profissional ou autor original)
  const displayAuthor = post.professional
    ? {
      name: post.professional.name,
      avatar: post.professional.avatar,
      title: post.professional.title,
      slug: post.professional.slug,
    }
    : {
      name: post.author?.name || "Autor Desconhecido",
      avatar: post.author?.avatar,
      title: "Escritor e Produtor",
      slug: null,
    }

  // Processar dados do post (após verificar que post existe)
  const postTags = post.tags?.map((tag: any) => tag.tag) || []
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // URL para compartilhamento
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = post.title

  return (
    <div className="flex min-h-screen flex-col bg-white">

      <div className="hidden md:block ">
        <MainSearchBar />
      </div>

      <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Main Content - Left Column */}
          <div className="w-full lg:w-3/4 lg:flex-shrink-0">
            {/* Post Title with Category Tag */}

            {/* Author Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {displayAuthor.avatar ? (
                  <Image
                    src={displayAuthor.avatar}
                    alt={displayAuthor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-lg font-bold">
                    {displayAuthor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                {displayAuthor.slug ? (
                  <Link href={`/profissional/${displayAuthor.slug}`}>
                    <h3 className="font-semibold text-base text-gray-900 hover:text-[#126861]">{displayAuthor.name}</h3>
                  </Link>
                ) : (
                  <h3 className="font-semibold text-base text-gray-900">{displayAuthor.name}</h3>
                )}
                <p className="text-xs text-gray-500">{displayAuthor.title}</p>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight uppercase mb-3">
                {post.title}
              </h1>
              {post.category && (
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="inline-block"
                >
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] text-white px-3 py-1.5 rounded text-xs font-semibold uppercase hidden md:block">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
            </div>
            {/* Subtitle/Excerpt */}
            {post.excerpt && (
              <p className="text-base text-gray-600 mb-6 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 relative w-full h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {/* Controles de Áudio e Fonte */}
            <div className="mb-8 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                {/* Audio Player */}
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={handleSpeak}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0`}
                    title={isSpeaking ? 'Parar áudio' : 'Ouvir conteúdo'}
                  >
                    <LuCirclePlay className={`w-12 h-12 ${isSpeaking ? 'text-red-600' : 'text-[#6D758F]'}`} />
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Ouça agora</p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#126861] transition-all"
                        style={{ width: totalTime > 0 ? `${(currentTime / totalTime) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(totalTime)}</span>
                    </div>
                  </div>
                </div>
                {/* Font Size Controls */}
                <div className="flex items-center gap-2 border-l border-gray-300 pl-6 md:hidden">
                  <button
                    onClick={handleDecreaseFont}
                    className="w-10 h-10 rounded bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-[#126861] transition-colors font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Fonte Pequena (L)"
                    disabled={fontSize <= 12}
                  >
                    -A
                  </button>
                  <button
                    onClick={() => setFontSize(16)}
                    className="w-10 h-10 rounded bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-[#126861] transition-colors font-bold text-gray-700"
                    title="Fonte Média (A)"
                  >
                    A
                  </button>
                  <button
                    onClick={handleIncreaseFont}
                    className="w-10 h-10 rounded bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-[#126861] transition-colors font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Fonte Grande (C)"
                    disabled={fontSize >= 32}
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-8" style={{ fontSize: `${fontSize}px` }}>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  fontSize: 'inherit',
                  lineHeight: '1.8'
                }}
                className="[&_img]:h-48 [&_img]:sm:h-56 [&_img]:w-full [&_img]:object-cover [&_img]:rounded-lg [&_img]:my-4 [&_mark]:bg-[#E8DED0] [&_mark]:px-1 [&_mark]:rounded"
              />
            </div>
            {/* Tags */}
            {postTags.length > 0 && (
              <div className="mb-8 flex items-center  gap-2">
                <div className="flex flex-col">
                  <p className="text-gray-600 font-lato text-base mb-8 mx-auto">Se você quer conhecer mais postagens sobre os temas(tags) que estão abaixos, clique em uma das tags abaixo que o portal vai apresentar as postagens relativas ao tema(tag) escolhido.</p>
                  <div className="flex flex-wrap gap-x-2 items-center">
                    <h3 className="text-[10px] font-normal text-white bg-[#928575]/40 w-fit px-4 py-1 rounded-md">TAGS:</h3>
                    {postTags.map((tag: any) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="flex items-center bg-gray-100 text-gray-700 px-4 py-[6px] rounded-md text-xs font-semibold uppercase hover:bg-gray-200 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Author Name and Share Buttons */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {displayAuthor.avatar ? (
                      <Image
                        src={displayAuthor.avatar}
                        alt={displayAuthor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-lg font-bold">
                        {displayAuthor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    {displayAuthor.slug ? (
                      <Link href={`/profissional/${displayAuthor.slug}`}>
                        <h3 className="font-semibold text-base text-gray-900 hover:text-[#126861]">{displayAuthor.name}</h3>
                      </Link>
                    ) : (
                      <h3 className="font-semibold text-base text-gray-900">{displayAuthor.name}</h3>
                    )}
                    <p className="text-xs text-gray-500">{displayAuthor.title}</p>
                  </div>
                </div>
                {/* Social Share */}
                <SocialShare className="border-none" />
              </div>
            </div>
            {/* Artigos Relacionados */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-medium text-center text-gray-900 mb-6 uppercase">Artigos Relacionados</h2>
                <Carousel opts={{ loop: true }} className="w-full flex flex-col">
                  <CarouselContent>
                    {relatedPosts.map((relatedPost) => (
                      <CarouselItem key={relatedPost.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {relatedPost.featured_image && (
                            <div className="relative h-48 w-full">
                              <Image
                                src={relatedPost.featured_image}
                                alt={relatedPost.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            {relatedPost.excerpt && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                            )}
                            <Link href={`/blog/${relatedPost.slug}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                Ler Mais
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselPrevious />
                  <CarouselNext /> */}
                </Carousel>
              </div>
            )}
            {/* Posts Mais Recentes */}
            {recentPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts Mais Recentes</h2>
                <div className="space-y-6 mx-4">
                  {recentPosts.map((recentPost) => (
                    <div key={recentPost.id} className="flex md:flex-row flex-col gap-4">
                      {recentPost.featured_image && (
                        <div className="relative w-auto lg:w-80 h-44 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={recentPost.featured_image}
                            alt={recentPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                          {recentPost.title}
                        </h3>
                        {recentPost.excerpt && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {recentPost.excerpt}
                          </p>
                        )}
                        <Link href={`/blog/${recentPost.slug}`}>
                          <Button variant="outline" size="sm" className="bg-[#928575] text-white hover:bg-[#928575]/80 hover:text-white">
                            VER MAIS SOBRE O ARTIGO
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar - Right Column */}
          <div className="w-full lg:w-1/4 mt-20 hidden lg:block">
            <BlogSidebarNew categories={categories || []} tags={tags || []} />
          </div>
        </div>

        {/* Compartilhe */}
        <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto px-4 mb-8">
          <SocialShare title={post?.title || ""} />
        </div>
      </div>
    </div>
  )
}



// TODO: Colocar pesquuisar com foto, tag e titulo na parte de config blog
// Titulo máximo 2 linhas
// Resumo maximo 2/3 linhas

// Para reflexao, titulo 3 linhas, desc 2linhas
// SOBRE RELACIONAMENTOS, titulo 2, desc 2linhas
// EMPRESAS & NEGÓCIOS, titulo 2, desc 2linhas

// Tag sempre em cima
// ESTÉTICA & BELEZA titulo 3

//GASTRONOMIA titulo 2, desc 2linhas

// Página /blog titulos 3, desc 2linhas

// Tirar verde do sidebar, alterar para o marrom
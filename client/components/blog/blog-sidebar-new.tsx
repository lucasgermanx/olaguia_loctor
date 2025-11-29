"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, ChevronDown } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostSuggestion {
  id: string
  title: string
  slug: string
}

interface BlogSidebarNewProps {
  categories: Category[]
  tags: Tag[]
}

export function BlogSidebarNew({ categories, tags }: BlogSidebarNewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isRevistaExpanded, setIsRevistaExpanded] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

  // Buscar sugestões de posts conforme o usuário digita (com debounce)
  useEffect(() => {
    const term = searchTerm.trim()

    if (term.length < 2) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true)
        const res = await fetch(
          `${API_URL}/posts?search=${encodeURIComponent(term)}&per_page=5`,
          { signal: controller.signal },
        )

        if (!res.ok) {
          setSuggestions([])
          return
        }

        const data = await res.json()
        const posts = (data.posts || []) as PostSuggestion[]
        setSuggestions(posts)
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [searchTerm, API_URL])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Helper function to normalize slug (same as backend)
  const normalizeSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]/g, '') // Remove special characters
  }

  // Helper function to find tag by name
  const findTagByName = (name: string) => {
    const normalizedSearchName = name.toLowerCase().trim()
    const normalizedSearchSlug = normalizeSlug(name)

    // Try exact match first
    let tag = tags.find(t =>
      t.name.toLowerCase().trim() === normalizedSearchName ||
      t.slug.toLowerCase() === normalizedSearchSlug
    )

    // If not found, try partial match
    if (!tag) {
      tag = tags.find(t =>
        t.name.toLowerCase().includes(normalizedSearchName) ||
        normalizedSearchName.includes(t.name.toLowerCase())
      )
    }

    // Debug log
    if (process.env.NODE_ENV === 'development' && !tag) {
      console.log(`Tag not found for: "${name}" (normalized: "${normalizedSearchSlug}")`)
      console.log('Available tags:', tags.map(t => ({ name: t.name, slug: t.slug })))
    }

    return tag
  }

  const revistaCategories = [
    "Reflexão",
    "Relacionamento",
    "OLÁ Gourmet",
    "Super Dicas",
    "Quebra Cuca",
    "Rindo à Toa",
    "Provérbios & Citações",
    "Edições Anteriores",
  ]

  const parceirosCategories = [
    "Empresas & Negócios",
    "Mantendo & Reformando",
    "Gastronomia",
    "Saúde",
    "Estética",
    "Serviços",
  ]

  const bibliotecaCategories = [
    "EMPREENDEDORISMO",
    "FINANÇAS",
    "VENDAS",
    "INTERNET",
    "MARKETING",
    "PUBLICIDADE",
  ]

  return (
    <div className="w-full space-y-8 lg:sticky lg:self-start border-2 px-6 py-4">
      {/* PESQUISAR */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Pesquisar</h3>
        <p className="text-sm text-gray-600 mb-4">
          Consectetuer nascetur orci et taciti maecenas ultricies varius quisque molestie
        </p>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (searchTerm.trim()) {
              window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`
            }
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#126861]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#126861] hover:text-[#0f5650]"
            aria-label="Pesquisar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </button>

          {/* Sugestões de posts */}
          {searchTerm.trim().length > 1 && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {isLoadingSuggestions && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">Buscando sugestões...</div>
              )}

              {!isLoadingSuggestions && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">Nenhum post encontrado.</div>
              )}

              {suggestions.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {post.title}
                </Link>
              ))}

              {suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      window.location.href = `/blog?search=${encodeURIComponent(searchTerm)}`
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-[#126861] hover:bg-gray-100 border-t border-gray-200"
                >
                  Ver todos os resultados para "{searchTerm}"
                </button>
              )}
            </div>
          )}
        </form>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* REVISTA */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Revista</h3>
          <button
            onClick={() => setIsRevistaExpanded(prev => !prev)}
            className="w-8 h-8 rounded-full bg-[#928575] flex items-center justify-center hover:bg-[#928575] transition-colors"
            aria-label="Expandir/collapse revista"
            type="button"
          >
            {isRevistaExpanded ? (
              // Up arrow
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              // Down arrow
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        </div>
        {isRevistaExpanded && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Consectetuer nascetur orci et taciti maecenas ultricies varius quisque molestie etiam semper parturient nisl tempus
            </p>
            <div className="space-y-2">
              {revistaCategories.map((category) => {
                const tag = findTagByName(category)
                const tagSlug = tag?.slug || normalizeSlug(category)

                return (
                  <Link
                    key={category}
                    href={`/blog?tag=${tagSlug}`}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-200 transition-colors group"
                  >
                    <Image src="/logoicon.png" alt={category} width={20} height={20} />
                    <span className="text-sm text-gray-700 group-hover:text-[#126861] transition-colors">
                      {category}
                    </span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
      <div className="border-t border-gray-300"></div>

      {/* CATEGORIAS DE PARCEIROS */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">CATEGORIAS DE PARCEIROS</h3>
        <p className="text-sm text-gray-600 mb-4">
          Consectetuer nascetur orci et taciti maecenas ultricies varius quisque molestie
        </p>
        <div className="space-y-2">
          {[
            "Empresas & Negócios",
            "Mantendo & Reformando",
            "Saúde",
            "Estética",
            "Serviços",
          ].map((cat) => {
            const tag = findTagByName(cat)
            const tagSlug = tag?.slug || normalizeSlug(cat)

            return (
              <Link
                key={cat}
                href={`/blog?tag=${tagSlug}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#126861] transition-colors"
              >
                <Image src="/logoicon.png" alt={cat} width={20} height={20} />
                <span>{cat}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="border-t-2 border-gray-300"></div>

      {/* BIBLIOTECA TÉCNICA */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Biblioteca Técnica</h3>
        <p className="text-sm text-gray-600 mb-4">
          Consectetuer nascetur orci et taciti maecerus ultricies varius quisque molestie etiam semper parturient nisl tempus
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "EMPREENDEDORISMO",
            "FINANÇAS",
            "VENDAS",
            "INTERNET",
            "MARKETING",
            "PUBLICIDADE",
          ].map((item) => {
            const tag = findTagByName(item)
            const tagSlug = tag?.slug || normalizeSlug(item)

            return (
              <Link
                key={item}
                href={`/blog?tag=${tagSlug}`}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors text-start block"
              >
                {item}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* NOSSOS SERVIÇOS */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Nossos Serviços</h3>
        <p className="text-sm text-gray-600 mb-4">
          Consectetuer nascetur orci et taciti maecenas ultricies varius quisque molestie
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Nenhum serviço disponível no momento.</p>
        </div>
      </div>
      <div className="border-t border-gray-300"></div>

      {/* NEWSLETTER */}
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Concordo em receber novas notícias através do nosso grupo. Para mais informações consulte nossa:
        </p>
        <p className="text-sm text-gray-900 mb-3 font-semibold">Entre no nosso grupo</p>
        <button
          className="w-fit bg-[#928575] hover:bg-[#928575]/80 text-white text-xs px-4 py-2 rounded-3xl uppercase"
          type="button"
        >
          ENTRAR NO GRUPO
        </button>
      </div>
    </div>
  )
}


import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebarNew } from "@/components/blog/blog-sidebar-new"
import { Pagination } from "@/components/blog/pagination"
import { MainSearchBar } from "@/components/blog/main-search-bar"
import { SocialShare } from "@/components/blog/social-share"
import Link from "next/link"

// Definir a URL da API com fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1003';

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

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  featured_image?: string
  published_at?: string
  created_at: string
  author?: {
    name: string
  }
  professional?: {
    name: string
    title: string
    avatar?: string
    slug: string
  }
  category?: {
    name: string
    slug: string
  }
}

async function getPosts(page = 1, category?: string, tag?: string, search?: string) {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  searchParams.append("per_page", "15");

  if (category) searchParams.append("category", category);
  if (tag) searchParams.append("tag", tag);
  if (search) searchParams.append("search", search);

  console.log(`Fetching from: ${API_URL}/posts?${searchParams.toString()}`);

  try {
    const res = await fetch(`${API_URL}/posts?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      return { posts: [], meta: { page: 1, per_page: 6, total: 0, total_pages: 0 } };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], meta: { page: 1, per_page: 6, total: 0, total_pages: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      return { categories: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

async function getTags() {
  try {
    const res = await fetch(`${API_URL}/tags`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch tags: ${res.status} ${res.statusText}`);
      return { tags: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { tags: [] };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; search?: string }>
}) {
  // Em versões recentes do Next.js, searchParams é uma Promise
  const resolvedSearchParams = await searchParams
  const params = resolvedSearchParams ? { ...resolvedSearchParams } : {}

  const page = params.page ? Number.parseInt(params.page) : 1;
  const { category, tag, search } = params;

  const [postsData, categoriesData, tagsData] = await Promise.all([
    getPosts(page, category, tag, search),
    getCategories(),
    getTags(),
  ]);

  const { posts, meta } = postsData;
  const { categories } = categoriesData;
  const { tags } = tagsData;

  return (
    <div className="flex min-h-screen flex-col mx-auto">
      <div className="pt-14 hidden md:block">
        {/* Main Search Bar */}
        <MainSearchBar />
      </div>

      {/* Main Content Section */}
      <section className="py-8 md:py-12 max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Left Side */}
            <div className="w-full lg:w-2/3">
              {/* Filter Messages */}
              {category && (
                <div className="mb-6">
                  <p className="text-[#126861] mb-2">
                    Filtrando por categoria:{" "}
                    <span className="font-semibold">
                      {(categories as Category[]).find((c: Category) => c.slug === category)?.name || category}
                    </span>
                  </p>
                  <Link href="/blog" className="text-[#126861] hover:underline">
                    Limpar filtro
                  </Link>
                </div>
              )}

              {tag && (
                <div className="mb-6">
                  <p className="text-[#126861] mb-2">
                    Filtrando por tag:{" "}
                    <span className="font-semibold">{(tags as Tag[]).find((t: Tag) => t.slug === tag)?.name || tag}</span>
                  </p>
                  <Link href="/blog" className="text-[#126861] hover:underline">
                    Limpar filtro
                  </Link>
                </div>
              )}

              {search && (
                <div className="mb-6">
                  <p className="text-[#126861] mb-2">
                    Resultados da busca por: <span className="font-semibold">{search}</span>
                  </p>
                  <Link href="/blog" className="text-[#126861] hover:underline">
                    Limpar busca
                  </Link>
                </div>
              )}

              {/* Posts Grid - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts && posts.length > 0 ? (
                  (posts as Post[]).map((post: Post) => (
                    <BlogPostCard
                      key={post.id}
                      title={post.title}
                      excerpt={post.excerpt || ""}
                      date={new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR")}
                      author={post.professional?.name || post.author?.name || "Autor Desconhecido"}
                      category={post.category?.name || "SAÚDE"}
                      slug={post.slug}
                      imageUrl={post.featured_image || "/placeholder.svg?height=200&width=400"}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-medium text-[#126861] mb-2">Nenhum artigo encontrado</h3>
                    <p className="text-gray-600">Não encontramos artigos que correspondam aos critérios de busca.</p>
                  </div>
                )}
              </div>

              {/* Ver todos os posts Button */}
              {posts && posts.length > 0 && meta && meta.total_pages > page && (
                <div className="mb-8 text-center">
                  <Link
                    href={`/blog?${new URLSearchParams({
                      page: (page + 1).toString(),
                      ...(category ? { category } : {}),
                      ...(tag ? { tag } : {}),
                      ...(search ? { search } : {}),
                    }).toString()}`}
                    className="inline-block bg-[#126861] hover:bg-[#0f5650] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Ver mais posts
                  </Link>
                </div>
              )}

              {/* Social Share */}
              <SocialShare />

              {/* Featured Article Section */}
              <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 uppercase">
                  Lorem Ipsum Dolor Sit Amet Consectetur Adipinsig
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 mb-4 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700 text-base">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>

              {/* Pagination */}
              {/* {meta && meta.total > meta.per_page && (
                <div className="mt-12">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.total_pages}
                    baseUrl={`/blog?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      ...(tag ? { tag } : {}),
                      ...(search ? { search } : {}),
                    }).toString()}`}
                  />
                </div>
              )} */}
            </div>

            {/* Sidebar - Right Side */}
            <div className="w-full lg:w-1/3 hidden md:block">
              <BlogSidebarNew categories={categories || []} tags={tags || []} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

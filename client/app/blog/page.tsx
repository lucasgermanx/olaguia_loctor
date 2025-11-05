import { Header } from "@/components/header"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { Pagination } from "@/components/blog/pagination"
import { BlogSearchBar } from "@/components/blog/blog-search-bar"

// Definir a URL da API com fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1003';

async function getPosts(page = 1, category?: string, tag?: string, search?: string) {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  searchParams.append("per_page", "6");

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
  searchParams: { page?: string; category?: string; tag?: string; search?: string }
}) {
  // Em versões recentes do Next.js, searchParams pode ser uma promessa
  // Vamos garantir que estamos trabalhando com um objeto regular
  const params = searchParams ? { ...searchParams } : {};

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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Blog Header */}
      <section className="bg-navy-950 py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Blog Jurídico</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Artigos, notícias e atualizações sobre o mundo jurídico, escritos pelos especialistas da Albuquerque Vianna
            Falcão Advogados.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <BlogSidebar categories={categories || []} tags={tags || []} />
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <div className="mb-8">
                <BlogSearchBar initialValue={search} />
              </div>

              {category && (
                <div className="mb-8">
                  <p className="text-navy-950 mb-2">
                    Filtrando por categoria:{" "}
                    <span className="font-semibold">
                      {categories.find((c) => c.slug === category)?.name || category}
                    </span>
                  </p>
                  <a href="/blog" className="text-gold hover:underline">
                    Limpar filtro
                  </a>
                </div>
              )}

              {tag && (
                <div className="mb-8">
                  <p className="text-navy-950 mb-2">
                    Filtrando por tag:{" "}
                    <span className="font-semibold">{tags.find((t) => t.slug === tag)?.name || tag}</span>
                  </p>
                  <a href="/blog" className="text-gold hover:underline">
                    Limpar filtro
                  </a>
                </div>
              )}

              {search && (
                <div className="mb-8">
                  <p className="text-navy-950 mb-2">
                    Resultados da busca por: <span className="font-semibold">{search}</span>
                  </p>
                  <a href="/blog" className="text-gold hover:underline">
                    Limpar busca
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <BlogPostCard
                      key={post.id}
                      title={post.title}
                      excerpt={post.excerpt || ""}
                      date={new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR")}
                      author={post.author?.name || "Autor Desconhecido"}
                      category={post.category?.name || "Sem Categoria"}
                      slug={post.slug}
                      imageUrl={post.featured_image || "/placeholder.svg?height=200&width=400"}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <h3 className="text-xl font-medium text-navy-950 mb-2">Nenhum artigo encontrado</h3>
                    <p className="text-gray-600">Não encontramos artigos que correspondam aos critérios de busca.</p>
                  </div>
                )}
              </div>

              {meta && meta.total > meta.per_page && (
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

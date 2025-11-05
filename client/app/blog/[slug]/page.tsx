"use client"

import { Header } from "@/components/header"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { CommentSection } from "@/components/blog/comment-section"
import { BlogAuthorCard } from "@/components/blog/blog-author-card"
import { BlogTagList } from "@/components/blog/blog-tag-list"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

// Definir a URL da API com fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1003';

async function getPost(slug: string) {
  try {
    console.log(`Fetching post from: ${API_URL}/posts/slug/${slug}`);
    const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch post: ${res.status} ${res.statusText}`);
      return { post: null };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return { post: null };
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

async function getComments(postId: string) {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch comments: ${res.status} ${res.statusText}`);
      return { comments: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { comments: [] };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Em versões recentes do Next.js, params pode ser uma promessa
  // Vamos garantir que estamos trabalhando com um objeto regular
  const routeParams = useParams()
  const { slug } = routeParams;

  // Verificar se slug existe
  if (!slug) {
    console.error("Slug is undefined");
    // Você pode redirecionar para uma página de erro ou retornar um componente de erro
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
          <p className="mb-8">O artigo que você está procurando não existe ou foi removido.</p>
          <Link href="/blog" className="text-gold hover:underline">
            Voltar para o blog
          </Link>
        </div>
      </div>
    );
  }

  // Buscar dados do post
  const { post } = await getPost(slug);

  // Se o post não for encontrado, mostrar uma mensagem de erro
  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
          <p className="mb-8">O artigo que você está procurando não existe ou foi removido.</p>
          <Link href="/blog" className="text-gold hover:underline">
            Voltar para o blog
          </Link>
        </div>
      </div>
    );
  }

  // Buscar categorias, tags e comentários
  const [categoriesData, tagsData, commentsData] = await Promise.all([
    getCategories(),
    getTags(),
    getComments(post.id),
  ]);

  const { categories } = categoriesData;
  const { tags } = tagsData;
  const { comments } = commentsData;

  // Processar dados do post
  const postTags = post.tags?.map((tag: any) => tag.tag) || [];
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Blog Post Header */}
      <section className="bg-navy-950 py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mb-4">
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`} className="text-gold hover:underline">
                {post.category.name}
              </Link>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center justify-center text-gray-300 text-sm">
            <span>Por {post.author?.name || "Autor Desconhecido"}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="mb-8 relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={post.featured_image || "/placeholder.svg?height=400&width=800"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags */}
              {postTags.length > 0 && (
                <div className="mt-8">
                  <BlogTagList tags={postTags} />
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <BlogAuthorCard
                  name={post.author?.name || "Autor Desconhecido"}
                  role="Advogado"
                  bio="Especialista em direito com vasta experiência na área."
                />
              </div>

              {/* Comments Section */}
              {/* <div className="mt-12 border-t border-gray-200 pt-8">
                <CommentSection postId={post.id} comments={comments || []} />
              </div> */}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

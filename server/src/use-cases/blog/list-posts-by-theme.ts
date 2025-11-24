import type { PostsRepository } from "@/repositories/posts-repository"
import { prisma } from "@/lib/prisma"
import type { Post } from "@prisma/client"

interface ListPostsByThemeUseCaseResponse {
  postsByTheme: Record<string, Record<string, Post[]>>
  ads: any[]
}

export class ListPostsByThemeUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute(): Promise<ListPostsByThemeUseCaseResponse> {
    // Buscar todos os posts publicados com tema e posição
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        theme: { not: null },
        position: { not: null },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { order: "asc" },
        { published_at: "desc" },
      ],
    })

    // Organizar posts por tema e posição
    const postsByTheme: Record<string, Record<string, Post[]>> = {}

    posts.forEach((post) => {
      if (post.theme && post.position) {
        if (!postsByTheme[post.theme]) {
          postsByTheme[post.theme] = {}
        }
        if (!postsByTheme[post.theme][post.position]) {
          postsByTheme[post.theme][post.position] = []
        }
        postsByTheme[post.theme][post.position].push(post as any)
      }
    })

    // Buscar anúncios ativos
    const ads = await prisma.ad.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    })

    return { postsByTheme, ads }
  }
}


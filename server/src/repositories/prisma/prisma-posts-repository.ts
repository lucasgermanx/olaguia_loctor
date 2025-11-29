import { prisma } from "@/lib/prisma"
import type { FindManyParams, PostsRepository } from "../posts-repository"
import type { Prisma } from "@prisma/client"

export class PrismaPostsRepository implements PostsRepository {
  async findById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            title: true,
            avatar: true,
            slug: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return post
  }

  async findBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            title: true,
            avatar: true,
            slug: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return post
  }

  async findMany({ page, per_page, category_slug, category_id, tag_slug, search, author_id, professional_id, published }: FindManyParams) {
    const where: Prisma.PostWhereInput = {}

    if (category_slug) {
      where.category = {
        slug: category_slug,
      }
    }

    // Suporte para filtro por ID de categoria também
    if (category_id) {
      where.category_id = category_id
    }

    if (tag_slug) {
      where.tags = {
        some: {
          tag: {
            slug: tag_slug,
          },
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    if (author_id) {
      where.author_id = author_id
    }

    if (professional_id) {
      where.professional_id = professional_id
    }

    if (published !== undefined) {
      console.log("🔍 Filtro por published:", published, "Tipo:", typeof published)
      where.published = published
    }

    console.log("🔍 Where clause final:", JSON.stringify(where, null, 2))

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          professional: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              slug: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          published_at: "desc",
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      prisma.post.count({ where }),
    ])

    return { posts, total }
  }

  async create(data: Prisma.PostUncheckedCreateInput) {
    const post = await prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            title: true,
            avatar: true,
            slug: true,
          },
        },
        category: true,
      },
    })

    return post
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            title: true,
            avatar: true,
            slug: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return post
  }
  async count() {
    const count = await prisma.post.count()
    return count
  }

  async delete(id: string) {
    await prisma.post.delete({
      where: { id },
    })
  }
}

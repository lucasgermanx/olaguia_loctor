import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListPostsUseCase } from "@/use-cases/factories/make-list-posts-use-case"

export async function listPosts(request: FastifyRequest, reply: FastifyReply) {
  const listPostsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(100).default(10),
    category: z.string().optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
  })

  const { page, per_page, category, tag, search } = listPostsQuerySchema.parse(request.query)

  // Normalize slugs: replace spaces with hyphens, convert to lowercase, and remove accents
  const normalizeSlug = (slug: string | undefined) => {
    if (!slug) return undefined
    
    return slug
      .toLowerCase()
      .trim()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]/g, '') // Remove special characters
  }

  const normalizedCategory = normalizeSlug(category)
  const normalizedTag = normalizeSlug(tag)

  try {
    const listPostsUseCase = makeListPostsUseCase()

    const { posts, total } = await listPostsUseCase.execute({
      page,
      per_page,
      category_slug: normalizedCategory,
      tag_slug: normalizedTag,
      search,
    })

    return reply.status(200).send({
      posts,
      meta: {
        total,
        page,
        per_page,
        total_pages: Math.ceil(total / per_page),
      },
    })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing posts" })
  }
}

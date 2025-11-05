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

  try {
    const listPostsUseCase = makeListPostsUseCase()

    const { posts, total } = await listPostsUseCase.execute({
      page,
      per_page,
      category_slug: category,
      tag_slug: tag,
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

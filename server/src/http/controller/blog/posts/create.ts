import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreatePostUseCase } from "@/use-cases/factories/make-create-post-use-case"

export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  const createPostBodySchema = z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string(),
    featured_image: z.string().optional(),
    published: z.boolean().default(false),
    category_id: z.string(),
    professional_id: z.string().optional(),
    tags: z.array(z.string()).optional()
  })

  const { title, slug, excerpt, content, featured_image, published, category_id, professional_id, tags } = createPostBodySchema.parse(
    request.body,
  )

  try {
    const createPostUseCase = makeCreatePostUseCase()

    const { post } = await createPostUseCase.execute({
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      excerpt,
      content,
      featured_image,
      published,
      category_id,
      professional_id: professional_id || undefined,
      author_id: request.user.sub,
      tags,
    })

    return reply.status(201).send({ post })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error creating post" })
  }
}

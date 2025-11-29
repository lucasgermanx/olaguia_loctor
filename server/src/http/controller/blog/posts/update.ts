import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdatePostUseCase } from "@/use-cases/factories/make-update-post-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function updatePost(request: FastifyRequest, reply: FastifyReply) {
  const updatePostParamsSchema = z.object({
    id: z.string(),
  })

  const updatePostBodySchema = z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    featured_image: z.string().optional(),
    published: z.boolean().optional(),
    category_id: z.string().optional(),
    professional_id: z.string().optional(),
    tags: z.array(z.string()).optional(),
    theme: z.string().optional(),
    position: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
  })
  console.log(request.body)
  const { id } = updatePostParamsSchema.parse(request.params)
  const data = updatePostBodySchema.parse(request.body)

  try {
    const updatePostUseCase = makeUpdatePostUseCase()

    const { post } = await updatePostUseCase.execute({
      id,
      ...data,
    })

    return reply.status(200).send({ post })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error updating post" })
  }
}

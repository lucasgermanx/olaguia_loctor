import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetPostBySlugUseCase } from "@/use-cases/factories/make-get-post-by-slug-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function getPostBySlug(request: FastifyRequest, reply: FastifyReply) {
  const getPostParamsSchema = z.object({
    slug: z.string(),
  })

  const { slug } = getPostParamsSchema.parse(request.params)

  try {
    const getPostUseCase = makeGetPostBySlugUseCase()

    const { post } = await getPostUseCase.execute({
      slug,
    })

    return reply.status(200).send({ post })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error fetching post" })
  }
}

import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"
import { makeGetPostByIdUseCase } from "@/use-cases/factories/make-get-post-by-id-use-case"

export async function getPostByID(request: FastifyRequest, reply: FastifyReply) {
  const getPostParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getPostParamsSchema.parse(request.params)

  try {
    const getPostUseCase = makeGetPostByIdUseCase()

    const { post } = await getPostUseCase.execute({
      id,
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

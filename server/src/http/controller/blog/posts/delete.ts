import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeDeletePostUseCase } from "@/use-cases/factories/make-delete-post-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
  const deletePostParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deletePostParamsSchema.parse(request.params)

  try {
    const deletePostUseCase = makeDeletePostUseCase()

    await deletePostUseCase.execute({
      id,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error deleting post" })
  }
}

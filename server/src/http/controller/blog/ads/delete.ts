import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeDeleteAdUseCase } from "@/use-cases/factories/make-delete-ad-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function deleteAd(request: FastifyRequest, reply: FastifyReply) {
  const deleteAdParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteAdParamsSchema.parse(request.params)

  try {
    const deleteAdUseCase = makeDeleteAdUseCase()

    await deleteAdUseCase.execute({ id })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error deleting ad" })
  }
}


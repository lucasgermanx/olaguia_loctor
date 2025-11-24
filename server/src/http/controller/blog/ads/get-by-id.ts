import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetAdByIdUseCase } from "@/use-cases/factories/make-get-ad-by-id-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function getAdById(request: FastifyRequest, reply: FastifyReply) {
  const getAdParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getAdParamsSchema.parse(request.params)

  try {
    const getAdByIdUseCase = makeGetAdByIdUseCase()

    const { ad } = await getAdByIdUseCase.execute({ id })

    return reply.status(200).send({ ad })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error getting ad" })
  }
}


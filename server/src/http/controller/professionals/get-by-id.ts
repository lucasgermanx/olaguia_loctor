import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetProfessionalByIdUseCase } from "@/use-cases/factories/make-get-professional-by-id-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function getProfessionalById(request: FastifyRequest, reply: FastifyReply) {
  const getProfessionalParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getProfessionalParamsSchema.parse(request.params)

  try {
    const getProfessionalByIdUseCase = makeGetProfessionalByIdUseCase()

    const { professional } = await getProfessionalByIdUseCase.execute({ id })

    return reply.status(200).send({ professional })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Professional not found" })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error getting professional" })
  }
}


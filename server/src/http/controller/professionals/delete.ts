import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeDeleteProfessionalUseCase } from "@/use-cases/factories/make-delete-professional-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function deleteProfessional(request: FastifyRequest, reply: FastifyReply) {
  const deleteProfessionalParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteProfessionalParamsSchema.parse(request.params)

  try {
    const deleteProfessionalUseCase = makeDeleteProfessionalUseCase()

    await deleteProfessionalUseCase.execute({ id })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Professional not found" })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error deleting professional" })
  }
}


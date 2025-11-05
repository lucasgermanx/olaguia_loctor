import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeDeleteTagUseCase } from "@/use-cases/factories/make-delete-tag-use-case"

export async function deleteTag(request: FastifyRequest, reply: FastifyReply) {
  const deleteTagParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteTagParamsSchema.parse(request.params)

  try {
    const deleteTagUseCase = makeDeleteTagUseCase()

    await deleteTagUseCase.execute({ id })

    return reply.status(204).send()
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error deleting tag" })
  }
}

import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeAssignPostToSlotUseCase } from "@/use-cases/factories/make-assign-post-to-slot-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function assignPostToSlot(request: FastifyRequest, reply: FastifyReply) {
  const assignPostBodySchema = z.object({
    slotId: z.string(),
    postId: z.string().nullable(),
  })

  const { slotId, postId } = assignPostBodySchema.parse(request.body)

  try {
    const assignPostToSlotUseCase = makeAssignPostToSlotUseCase()

    const { slot } = await assignPostToSlotUseCase.execute({
      slotId,
      postId,
    })

    return reply.status(200).send({ slot })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error assigning post to slot" })
  }
}


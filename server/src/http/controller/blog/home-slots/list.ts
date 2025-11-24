import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListHomeSlotsUseCase } from "@/use-cases/factories/make-list-home-slots-use-case"

export async function listHomeSlots(request: FastifyRequest, reply: FastifyReply) {
  const listHomeSlotsQuerySchema = z.object({
    section: z.string().optional(),
  })

  const { section } = listHomeSlotsQuerySchema.parse(request.query)

  try {
    const listHomeSlotsUseCase = makeListHomeSlotsUseCase()

    const { slots } = await listHomeSlotsUseCase.execute(section)

    return reply.status(200).send({ slots })
  } catch (err: any) {
    console.error("Error listing home slots:", err)
    return reply.status(500).send({ 
      message: "Error listing home slots",
      error: err.message || String(err)
    })
  }
}


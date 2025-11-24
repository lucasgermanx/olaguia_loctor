import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdateAdUseCase } from "@/use-cases/factories/make-update-ad-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function updateAd(request: FastifyRequest, reply: FastifyReply) {
  const updateAdParamsSchema = z.object({
    id: z.string(),
  })

  const updateAdBodySchema = z.object({
    title: z.string().optional(),
    image_url: z.string().optional(),
    link_url: z.string().optional(),
    position: z.string().optional(),
    active: z.boolean().optional(),
    order: z.number().optional(),
  })

  const { id } = updateAdParamsSchema.parse(request.params)
  const data = updateAdBodySchema.parse(request.body)

  try {
    const updateAdUseCase = makeUpdateAdUseCase()

    const { ad } = await updateAdUseCase.execute({
      id,
      ...data,
    })

    return reply.status(200).send({ ad })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error updating ad" })
  }
}


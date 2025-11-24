import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateAdUseCase } from "@/use-cases/factories/make-create-ad-use-case"

export async function createAd(request: FastifyRequest, reply: FastifyReply) {
  const createAdBodySchema = z.object({
    title: z.string(),
    image_url: z.string(),
    link_url: z.string().optional(),
    position: z.string(),
    active: z.boolean().optional().default(true),
    order: z.number().optional().default(0),
  })

  const { title, image_url, link_url, position, active, order } = createAdBodySchema.parse(request.body)

  try {
    const createAdUseCase = makeCreateAdUseCase()

    const { ad } = await createAdUseCase.execute({
      title,
      image_url,
      link_url,
      position,
      active,
      order,
    })

    return reply.status(201).send({ ad })
  } catch (err: any) {
    console.error(err)
    return reply.status(500).send({ message: err.message || "Error creating ad" })
  }
}


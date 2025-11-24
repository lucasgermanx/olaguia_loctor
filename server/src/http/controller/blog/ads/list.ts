import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListAdsUseCase } from "@/use-cases/factories/make-list-ads-use-case"

export async function listAds(request: FastifyRequest, reply: FastifyReply) {
  const listAdsQuerySchema = z.object({
    active_only: z.coerce.boolean().optional().default(false),
  })

  const { active_only } = listAdsQuerySchema.parse(request.query)

  try {
    const listAdsUseCase = makeListAdsUseCase()

    const { ads } = await listAdsUseCase.execute(active_only)

    return reply.status(200).send({ ads })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing ads" })
  }
}


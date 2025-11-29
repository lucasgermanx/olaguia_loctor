import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetProfessionalBySlugUseCase } from "@/use-cases/factories/make-get-professional-by-slug-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function getProfessionalBySlug(request: FastifyRequest, reply: FastifyReply) {
  const getProfessionalParamsSchema = z.object({
    slug: z.string(),
  })

  const { slug } = getProfessionalParamsSchema.parse(request.params)

  try {
    const getProfessionalBySlugUseCase = makeGetProfessionalBySlugUseCase()

    const { professional } = await getProfessionalBySlugUseCase.execute({ slug })

    return reply.status(200).send({ professional })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Professional not found" })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error getting professional" })
  }
}


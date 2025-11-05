import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdateTagUseCase } from "@/use-cases/factories/make-update-tag-use-case"

export async function updateTag(request: FastifyRequest, reply: FastifyReply) {
  const updateTagParamsSchema = z.object({
    id: z.string(),
  })

  const updateTagBodySchema = z.object({
    name: z.string(),
    slug: z.string(),
    color: z.string().optional(),
  })

  const { id } = updateTagParamsSchema.parse(request.params)
  const { name, slug, color } = updateTagBodySchema.parse(request.body)

  try {
    const updateTagUseCase = makeUpdateTagUseCase()

    const { tag } = await updateTagUseCase.execute({
      id,
      name,
      slug,
      color,
    })

    return reply.status(200).send({ tag })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error updating tag" })
  }
}

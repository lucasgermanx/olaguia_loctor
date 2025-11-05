import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdateCategoryUseCase } from "@/use-cases/factories/make-update-category-use-case"

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const updateCategoryParamsSchema = z.object({
    id: z.string(),
  })

  const updateCategoryBodySchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  })

  const { id } = updateCategoryParamsSchema.parse(request.params)
  const { name, slug, description } = updateCategoryBodySchema.parse(request.body)

  try {
    const updateCategoryUseCase = makeUpdateCategoryUseCase()

    const { category } = await updateCategoryUseCase.execute({
      id,
      name,
      slug,
      description,
    })

    return reply.status(200).send({ category })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error updating category" })
  }
}

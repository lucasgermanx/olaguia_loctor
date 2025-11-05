import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetCategoryByIdUseCase } from "@/use-cases/factories/make-get-category-by-id-use-case"

export async function getCategoryById(request: FastifyRequest, reply: FastifyReply) {
  const getCategoryParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getCategoryParamsSchema.parse(request.params)

  try {
    const getCategoryByIdUseCase = makeGetCategoryByIdUseCase()

    const { category } = await getCategoryByIdUseCase.execute({ id })

    return reply.status(200).send({ category })
  } catch (err) {
    console.error(err)
    return reply.status(404).send({ message: "Category not found" })
  }
}

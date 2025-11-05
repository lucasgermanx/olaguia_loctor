import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeDeleteCategoryUseCase } from "@/use-cases/factories/make-delete-category-use-case"

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const deleteCategoryParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteCategoryParamsSchema.parse(request.params)

  try {
    const deleteCategoryUseCase = makeDeleteCategoryUseCase()

    await deleteCategoryUseCase.execute({ id })

    return reply.status(204).send()
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error deleting category" })
  }
}

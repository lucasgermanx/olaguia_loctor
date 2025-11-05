import type { FastifyRequest, FastifyReply } from "fastify"
import { makeListCategoriesUseCase } from "@/use-cases/factories/make-list-categories-use-case"

export async function listCategories(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listCategoriesUseCase = makeListCategoriesUseCase()

    const { categories } = await listCategoriesUseCase.execute()

    return reply.status(200).send({ categories })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing categories" })
  }
}

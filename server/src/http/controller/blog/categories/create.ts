import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateCategoryUseCase } from "@/use-cases/factories/make-create-category-use-case"

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const createCategoryBodySchema = z.object({
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
  })

  const { name, slug, description } = createCategoryBodySchema.parse(request.body)

  try {
    const createCategoryUseCase = makeCreateCategoryUseCase()

    const { category } = await createCategoryUseCase.execute({
      name,
      slug:
        slug ||
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      description,
    })

    return reply.status(201).send({ category })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error creating category" })
  }
}

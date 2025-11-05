import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateTagUseCase } from "@/use-cases/factories/make-create-tag-use-case"

export async function createTag(request: FastifyRequest, reply: FastifyReply) {
  const createTagBodySchema = z.object({
    name: z.string(),
    slug: z.string().optional(),
    color: z.string().optional(),
  })

  const { name, slug, color } = createTagBodySchema.parse(request.body)

  try {
    const createTagUseCase = makeCreateTagUseCase()

    const { tag } = await createTagUseCase.execute({
      name,
      slug:
        slug ||
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      color: color || "#3B82F6", // Cor padrão se não for fornecida
    })

    return reply.status(201).send({ tag })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error creating tag" })
  }
}

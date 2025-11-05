import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetTagByIdUseCase } from "@/use-cases/factories/make-get-tag-by-id-use-case"

export async function getTagById(request: FastifyRequest, reply: FastifyReply) {
  const getTagParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getTagParamsSchema.parse(request.params)

  try {
    const getTagByIdUseCase = makeGetTagByIdUseCase()

    const { tag } = await getTagByIdUseCase.execute({ id })

    return reply.status(200).send({ tag })
  } catch (err) {
    console.error(err)
    return reply.status(404).send({ message: "Tag not found" })
  }
}

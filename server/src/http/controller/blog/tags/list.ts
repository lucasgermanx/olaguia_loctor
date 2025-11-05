import type { FastifyRequest, FastifyReply } from "fastify"
import { makeListTagsUseCase } from "@/use-cases/factories/make-list-tags-use-case"

export async function listTags(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listTagsUseCase = makeListTagsUseCase()

    const { tags } = await listTagsUseCase.execute()

    return reply.status(200).send({ tags })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing tags" })
  }
}

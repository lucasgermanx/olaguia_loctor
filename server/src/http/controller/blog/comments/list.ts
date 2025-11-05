import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListCommentsUseCase } from "@/use-cases/factories/make-list-comments-use-case"

export async function listComments(request: FastifyRequest, reply: FastifyReply) {
  const listCommentsParamsSchema = z.object({
    postId: z.string(),
  })

  const { postId } = listCommentsParamsSchema.parse(request.params)

  try {
    const listCommentsUseCase = makeListCommentsUseCase()

    const { comments } = await listCommentsUseCase.execute({
      post_id: postId,
    })

    return reply.status(200).send({ comments })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing comments" })
  }
}

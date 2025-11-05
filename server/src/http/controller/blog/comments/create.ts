import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateCommentUseCase } from "@/use-cases/factories/make-create-comment-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function createComment(request: FastifyRequest, reply: FastifyReply) {
  const createCommentBodySchema = z.object({
    post_id: z.string(),
    content: z.string(),
    parent_id: z.string().optional(),
  })

  const { post_id, content, parent_id } = createCommentBodySchema.parse(request.body)

  try {
    const createCommentUseCase = makeCreateCommentUseCase()

    const { comment } = await createCommentUseCase.execute({
      post_id,
      content,
      author_id: request.user.sub,
      parent_id,
    })

    return reply.status(201).send({ comment })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error creating comment" })
  }
}

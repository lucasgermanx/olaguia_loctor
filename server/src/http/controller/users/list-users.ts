import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListUsersUseCase } from "@/use-cases/factories/make-list-users-use-case"

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const listUsersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
  })

  const { page, per_page, search } = listUsersQuerySchema.parse(request.query)

  try {
    const listUsersUseCase = makeListUsersUseCase()

    const result = await listUsersUseCase.execute({
      page,
      per_page,
      search,
    })

    return reply.status(200).send(result)
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing users" })
  }
}

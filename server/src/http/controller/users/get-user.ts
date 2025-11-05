import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeGetUserUseCase } from "@/use-cases/factories/make-get-user-use-case"

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const listUsersQuerySchema = z.object({
    userId: z.string()
  })

  console.log(request.params)
  const { userId } = listUsersQuerySchema.parse(request.params)

  try {
    const getUserUseCase = makeGetUserUseCase()

    const result = await getUserUseCase.execute({ userId })
    return reply.status(200).send(result)
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error fetching users" })
  }
}

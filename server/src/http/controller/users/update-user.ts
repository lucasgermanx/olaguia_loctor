import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdateUserUseCase } from "@/use-cases/factories/make-update-user-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    userId: z.string().uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    role: z.enum(["ADMIN", "MEMBER"]),
    avatar: z.string().optional(),
  })

  const { userId } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserUseCase()

    const { user } = await updateUserUseCase.execute({
      id: userId,
      ...data,
    })

    return reply.status(200).send(user)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "User not found." })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error updating user" })
  }
}

import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UpdateProfileUseCase } from "@/use-cases/users/update-profile"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositories"

const updateProfileBodySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    avatar: z.string().optional(),
})

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { name, avatar } = updateProfileBodySchema.parse(request.body)
        const userId = request.user.sub

        const usersRepository = new PrismaUsersRepository()
        const updateProfileUseCase = new UpdateProfileUseCase(usersRepository)

        const { user } = await updateProfileUseCase.execute({
            userId,
            name,
            avatar,
        })

        return reply.status(200).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            message: "Perfil atualizado com sucesso",
        })
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
}

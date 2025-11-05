import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { CreateUserUseCase } from "@/use-cases/users/create-user"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositories"

const createUserBodySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
    avatar: z.string().optional(),
})

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { name, email, password, role, avatar } = createUserBodySchema.parse(request.body)

        const usersRepository = new PrismaUsersRepository()
        const createUserUseCase = new CreateUserUseCase(usersRepository)

        const { user } = await createUserUseCase.execute({
            name,
            email,
            password,
            role,
            avatar,
        })

        return reply.status(201).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
            message: "Usuário criado com sucesso",
        })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: error.message,
            })
        }

        console.error("Erro ao criar usuário:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
} 
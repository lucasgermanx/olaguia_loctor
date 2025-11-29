import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { ListUploadsUseCase } from "@/use-cases/upload/list-uploads"
import { PrismaUploadRepository } from "@/repositories/prisma/prisma-upload-repository"

export async function listUploads(request: FastifyRequest, reply: FastifyReply) {
    const listUploadsQuerySchema = z.object({
        page: z.coerce.number().int().positive().default(1),
        per_page: z.coerce.number().int().positive().max(100).default(30),
    })

    const { page, per_page } = listUploadsQuerySchema.parse(request.query)

    try {
        const uploadRepository = new PrismaUploadRepository()
        const listUploadsUseCase = new ListUploadsUseCase(uploadRepository)

        const result = await listUploadsUseCase.execute({
            page,
            per_page,
        })

        return reply.status(200).send(result)
    } catch (error) {
        console.error("Erro ao listar uploads:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
}


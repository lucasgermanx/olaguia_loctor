import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { PrismaUploadRepository } from "@/repositories/prisma/prisma-upload-repository"
import { DeleteUploadUseCase } from "@/use-cases/upload/delete-upload"

const deleteUploadParamsSchema = z.object({
    id: z.string(),
})

export async function deleteUpload(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = deleteUploadParamsSchema.parse(request.params)

        const uploadRepository = new PrismaUploadRepository()
        const deleteUploadUseCase = new DeleteUploadUseCase(uploadRepository)

        await deleteUploadUseCase.execute({ id })

        return reply.status(200).send({
            message: "Upload deletado com sucesso",
        })
    } catch (error) {
        console.error("Erro ao deletar upload:", error)

        if (error instanceof Error && error.message === "Upload não encontrado") {
            return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
}


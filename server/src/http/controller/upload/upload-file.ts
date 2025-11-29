import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UploadUseCase } from "@/use-cases/upload/upload-file"
import { PrismaUploadRepository } from "@/repositories/prisma/prisma-upload-repository"

const uploadFileBodySchema = z.object({
  file: z.any(),
  type: z.enum(["user", "post"]),
  entityId: z.string().optional(),
})

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({
        message: "Nenhum arquivo enviado",
      })
    }

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({
        message: "Tipo de arquivo não suportado. Use apenas imagens (JPEG, PNG, WebP, GIF)",
      })
    }

    // Validar tamanho (máximo 15MB)
    const maxSize = 15 * 1024 * 1024 // 15MB
    // O Fastify multipart não expõe bytesRead diretamente, vamos validar no use case

    // Pegar dados do formulário
    const type = (data.fields?.type as any)?.value || "post"
    const entityId = (data.fields?.entityId as any)?.value

    const uploadRepository = new PrismaUploadRepository()
    const uploadUseCase = new UploadUseCase(uploadRepository)

    const { fileUrl } = await uploadUseCase.execute({
      file: data.file,
      filename: data.filename,
      mimetype: data.mimetype,
      type,
      entityId,
    })

    return reply.status(200).send({
      fileUrl,
      message: "Arquivo enviado com sucesso",
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return reply.status(500).send({
      message: "Erro interno do servidor",
    })
  }
} 
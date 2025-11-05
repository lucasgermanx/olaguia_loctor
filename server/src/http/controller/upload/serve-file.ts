import type { FastifyReply, FastifyRequest } from "fastify"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function serveFile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { filename } = request.params as { filename: string }
        const { type } = request.query as { type: string }

        if (!filename || !type) {
            return reply.status(400).send({
                message: "Parâmetros inválidos",
            })
        }

        const uploadDir = type === "user" ? "uploads/users" : "uploads/posts"
        const filePath = join(process.cwd(), "public", uploadDir, filename)

        if (!existsSync(filePath)) {
            return reply.status(404).send({
                message: "Arquivo não encontrado",
            })
        }

        const fileBuffer = await readFile(filePath)

        // Determinar o tipo MIME baseado na extensão
        const ext = filename.split(".").pop()?.toLowerCase()
        let contentType = "application/octet-stream"

        switch (ext) {
            case "jpg":
            case "jpeg":
                contentType = "image/jpeg"
                break
            case "png":
                contentType = "image/png"
                break
            case "gif":
                contentType = "image/gif"
                break
            case "webp":
                contentType = "image/webp"
                break
        }

        reply.header("Content-Type", contentType)
        reply.header("Cache-Control", "public, max-age=31536000")

        return reply.send(fileBuffer)
    } catch (error) {
        console.error("Erro ao servir arquivo:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
} 
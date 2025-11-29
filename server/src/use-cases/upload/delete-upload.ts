import type { UploadRepository } from "@/repositories/upload-repository"
import { unlink } from "node:fs/promises"
import { join } from "node:path"

interface DeleteUploadUseCaseRequest {
    id: string
}

export class DeleteUploadUseCase {
    constructor(private uploadRepository: UploadRepository) { }

    async execute({ id }: DeleteUploadUseCaseRequest): Promise<void> {
        // Buscar upload no banco
        const upload = await this.uploadRepository.findById(id)

        if (!upload) {
            throw new Error("Upload não encontrado")
        }

        // Determinar pasta baseada no tipo
        const uploadDir = upload.type === "user" ? "uploads/users" : "uploads/posts"
        const filePath = join(process.cwd(), "public", uploadDir, upload.filename)

        // Deletar arquivo físico
        try {
            await unlink(filePath)
        } catch (error) {
            console.error("Erro ao deletar arquivo físico:", error)
            // Continua mesmo se o arquivo não existir
        }

        // Deletar do banco de dados
        await this.uploadRepository.delete(id)
    }
}


import { UploadRepository } from "@/repositories/upload-repository"
import { randomUUID } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

interface UploadUseCaseRequest {
  file: any
  filename: string
  mimetype: string
  type: "user" | "post"
  entityId?: string
}

interface UploadUseCaseResponse {
  fileUrl: string
}

export class UploadUseCase {
  constructor(private uploadRepository: UploadRepository) { }

  async execute({
    file,
    filename,
    mimetype,
    type,
    entityId,
  }: UploadUseCaseRequest): Promise<UploadUseCaseResponse> {
    // Gerar nome único para o arquivo
    const fileExtension = filename.split(".").pop()
    const uniqueFilename = `${randomUUID()}.${fileExtension}`

    // Determinar pasta baseada no tipo
    const uploadDir = type === "user" ? "uploads/users" : "uploads/posts"
    const uploadPath = join(process.cwd(), "public", uploadDir)

    // Criar diretório se não existir
    await mkdir(uploadPath, { recursive: true })

    // Caminho completo do arquivo
    const filePath = join(uploadPath, uniqueFilename)

    // Salvar arquivo
    const chunks = []
    for await (const chunk of file) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (buffer.length > maxSize) {
      throw new Error("Arquivo muito grande. Máximo 5MB")
    }

    await writeFile(filePath, buffer)

    // URL pública do arquivo
    const fileUrl = `/files/${uniqueFilename}?type=${type}`

    // Salvar no banco de dados
    await this.uploadRepository.create({
      id: randomUUID(),
      filename: uniqueFilename,
      originalName: filename,
      mimetype,
      size: buffer.length,
      url: fileUrl,
      type,
      entityId,
    })

    return {
      fileUrl,
    }
  }
} 
import { prisma } from "@/lib/prisma"
import { Upload, UploadRepository } from "@/repositories/upload-repository"

export class PrismaUploadRepository implements UploadRepository {
  async create(data: Omit<Upload, "created_at">): Promise<Upload> {
    const upload = await prisma.upload.create({
      data: {
        id: data.id,
        filename: data.filename,
        originalName: data.originalName,
        mimetype: data.mimetype,
        size: data.size,
        url: data.url,
        type: data.type,
        entityId: data.entityId,
      },
    })

    return {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      mimetype: upload.mimetype,
      size: upload.size,
      url: upload.url,
      type: upload.type as "user" | "post",
      entityId: upload.entityId,
      created_at: upload.created_at,
    }
  }

  async findById(id: string): Promise<Upload | null> {
    const upload = await prisma.upload.findUnique({
      where: { id },
    })

    if (!upload) {
      return null
    }

    return {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      mimetype: upload.mimetype,
      size: upload.size,
      url: upload.url,
      type: upload.type as "user" | "post",
      entityId: upload.entityId,
      created_at: upload.created_at,
    }
  }

  async findByEntityId(entityId: string): Promise<Upload | null> {
    const upload = await prisma.upload.findFirst({
      where: { entityId },
    })

    if (!upload) {
      return null
    }

    return {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      mimetype: upload.mimetype,
      size: upload.size,
      url: upload.url,
      type: upload.type as "user" | "post",
      entityId: upload.entityId,
      created_at: upload.created_at,
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.upload.delete({
      where: { id },
    })
  }
} 
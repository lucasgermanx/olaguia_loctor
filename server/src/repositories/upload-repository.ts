export interface Upload {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  type: "user" | "post"
  entityId?: string
  created_at: Date
}

export interface UploadRepository {
  create(data: Omit<Upload, "created_at">): Promise<Upload>
  findById(id: string): Promise<Upload | null>
  findByEntityId(entityId: string): Promise<Upload | null>
  delete(id: string): Promise<void>
} 
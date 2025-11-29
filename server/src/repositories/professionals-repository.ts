import type { Prisma, Professional } from "@prisma/client"

export interface FindManyParams {
  page: number
  per_page: number
  city?: string
  specialty?: string
  search?: string
  active?: boolean
  featured?: boolean
}

export interface ProfessionalsRepository {
  findById(id: string): Promise<Professional | null>
  findBySlug(slug: string): Promise<Professional | null>
  findMany(params: FindManyParams): Promise<{ professionals: Professional[]; total: number }>
  create(data: Prisma.ProfessionalCreateInput): Promise<Professional>
  update(id: string, data: Prisma.ProfessionalUpdateInput): Promise<Professional>
  delete(id: string): Promise<void>
  count(): Promise<number>
}


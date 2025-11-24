import type { Prisma, Ad } from "@prisma/client"

export interface AdsRepository {
  findById(id: string): Promise<Ad | null>
  findByPosition(position: string): Promise<Ad | null>
  findMany(): Promise<Ad[]>
  findActive(): Promise<Ad[]>
  create(data: Prisma.AdUncheckedCreateInput): Promise<Ad>
  update(id: string, data: Prisma.AdUpdateInput): Promise<Ad>
  delete(id: string): Promise<void>
}


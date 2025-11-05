import type { Prisma, Tag } from "@prisma/client"

export interface TagsRepository {
  findById(id: string): Promise<Tag | null>
  delete(id: string): Promise<void>
  findByName(name: string): Promise<Tag | null>
  findBySlug(slug: string): Promise<Tag | null>
  findMany(): Promise<Tag[]>
  create(data: Prisma.TagCreateInput): Promise<Tag>
  count(): Promise<number>
  update(id: string, data: Prisma.TagUpdateInput): Promise<Tag>
}

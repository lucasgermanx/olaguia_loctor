import type { Category, Prisma } from "@prisma/client"

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  findMany(): Promise<Category[]>
  create(data: Prisma.CategoryCreateInput): Promise<Category>
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>
  delete(id: string): Promise<void>
  count(): Promise<number>
}

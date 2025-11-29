import type { Prisma, Post } from "@prisma/client"

export interface FindManyParams {
  page: number
  per_page: number
  category_slug?: string
  category_id?: string
  tag_slug?: string
  search?: string
  author_id?: string
  professional_id?: string
  published?: boolean
}

export interface PostsRepository {
  findById(id: string): Promise<Post | null>
  findBySlug(slug: string): Promise<Post | null>
  findMany(params: FindManyParams): Promise<{ posts: Post[]; total: number }>
  create(data: Prisma.PostUncheckedCreateInput): Promise<Post>
  update(id: string, data: Prisma.PostUpdateInput): Promise<Post>
  delete(id: string): Promise<void>
  count(): Promise<number>
}

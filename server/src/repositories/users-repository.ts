import type { Prisma, User } from "@prisma/client"

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>
  count(): Promise<number>
  findMany(params?: {
    page?: number
    per_page?: number
    search?: string
  }): Promise<{
    users: User[]
    meta: {
      page: number
      per_page: number
      total: number
      total_pages: number
    }
  }>
}

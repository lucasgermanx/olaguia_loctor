import type { UsersRepository } from "@/repositories/users-repository"
import type { User } from "@prisma/client"

interface ListUsersUseCaseRequest {
  page: number
  per_page: number
  search?: string
}

interface ListUsersUseCaseResponse {
  users: Omit<User, "password_hash">[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ page, per_page, search }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const result = await this.usersRepository.findMany({
      page,
      per_page,
      search,
    })

    // Remove password_hash from response
    const users = result.users.map(({ password_hash, ...user }) => user)

    return {
      users,
      meta: result.meta,
    }
  }
}

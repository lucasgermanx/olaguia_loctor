import type { UsersRepository } from "@/repositories/users-repository"
import type { User } from "@prisma/client"

interface ListUsersUseCaseRequest {
  userId: string
}

interface ListUsersUseCaseResponse {
  user: Omit<User, "password_hash">
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ userId }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse | false> {
    const result = await this.usersRepository.findById(userId)
    console.log({ userId })
    if (!result) return false

    result.password_hash = ""
    return {
      user: result,
    }
  }
}

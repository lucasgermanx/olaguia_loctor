import { UsersRepository } from "@/repositories/users-repository"

interface UpdateProfileUseCaseRequest {
  userId: string
  name: string
  avatar?: string
}

interface UpdateProfileUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
}

export class UpdateProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    name,
    avatar,
  }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    const updatedUser = await this.usersRepository.update(userId, {
      name,
      avatar,
    })

    return {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
      },
    }
  }
} 
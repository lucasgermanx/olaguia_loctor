import type { UsersRepository } from "@/repositories/users-repository"
import type { User } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import { hash } from "bcryptjs"

interface UpdateUserUseCaseRequest {
  id: string
  name: string
  email: string
  password?: string
  role: "ADMIN" | "MEMBER"
  avatar?: string
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    id,
    name,
    email,
    password,
    role,
    avatar,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(id)

    if (!existingUser) {
      throw new ResourceNotFoundError()
    }

    const hashedPassword = password
      ? await hash(password, 8)
      : undefined

    const user = await this.usersRepository.update(id, {
      name,
      email,
      password_hash: hashedPassword,
      role,
      avatar,
    })

    return { user }
  }
}

import { UsersRepository } from "@/repositories/users-repository"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { hash } from "bcryptjs"

interface CreateUserUseCaseRequest {
    name: string
    email: string
    password: string
    role: "ADMIN" | "MEMBER"
    avatar?: string
}

interface CreateUserUseCaseResponse {
    user: {
        id: string
        name: string
        email: string
        role: string
        avatar?: string
    }
}

export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({
        name,
        email,
        password,
        role,
        avatar,
    }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        const password_hash = await hash(password, 8)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
            role,
            avatar,
        })

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        }
    }
} 
import { prisma } from "@/lib/prisma"
import type { Prisma, User } from "@prisma/client"
import type { UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async count() {
    const count = await prisma.user.count()
    return count
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async findMany(params = {}) {
    const { page = 1, per_page = 10, search } = params

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      meta: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
    }
  }
}

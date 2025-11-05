import { prisma } from "@/lib/prisma"
import type { CategoriesRepository } from "../categories-repository"
import type { Prisma } from "@prisma/client"

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    return category
  }

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    return category
  }

  async findMany() {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return categories;
  }


  async create(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({
      data,
    })

    return category
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return category
  }

  async delete(id: string) {
    await prisma.category.delete({
      where: { id },
    })
  }

  async count() {
    const count = await prisma.category.count()
    return count
  }
}

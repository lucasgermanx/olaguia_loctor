import { prisma } from "@/lib/prisma"
import type { TagsRepository } from "../tags-repository"
import type { Prisma, Tag } from "@prisma/client"

export class PrismaTagsRepository implements TagsRepository {
  async findById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
    })

    return tag
  }

  async findByName(name: string) {
    const tag = await prisma.tag.findUnique({
      where: { name },
    })

    return tag
  }

  async findBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
    })

    return tag
  }

  async findMany() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    // Ordenar alfabeticamente respeitando acentos do português
    return tags.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    )
  }

  async create(data: Prisma.TagCreateInput) {

    console.log({ data })

    const tag = await prisma.tag.create({
      data,
    })

    return tag
  }
  async update(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {

    console.log({ data })
    const tag = await prisma.tag.update(
      {
        where: { id },
        data,
      })

    return tag
  }
  async count() {
    const count = await prisma.tag.count()
    return count
  }
  async delete(id: string) {
    await prisma.tag.delete({
      where: { id },
    })
  }
}

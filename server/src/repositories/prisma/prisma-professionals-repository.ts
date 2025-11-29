import { prisma } from "@/lib/prisma"
import type { FindManyParams, ProfessionalsRepository } from "../professionals-repository"
import type { Prisma } from "@prisma/client"

export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  async findById(id: string) {
    const professional = await prisma.professional.findUnique({
      where: { id },
    })

    return professional
  }

  async findBySlug(slug: string) {
    const professional = await prisma.professional.findUnique({
      where: { slug },
    })

    return professional
  }

  async findMany({ page, per_page, city, specialty, search, active, featured }: FindManyParams) {
    const where: Prisma.ProfessionalWhereInput = {}

    // Filtro de ativo
    if (active !== undefined) {
      where.active = active
    }

    // Filtro de destaque
    if (featured !== undefined) {
      where.featured = featured
    }

    // Filtro de cidade
    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      }
    }

    // Filtro de especialidade
    if (specialty) {
      where.specialty = {
        contains: specialty,
        mode: "insensitive",
      }
    }

    // Busca por texto
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { specialty: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ]
    }

    const [professionals, total] = await Promise.all([
      prisma.professional.findMany({
        where,
        orderBy: [
          { featured: "desc" },
          { created_at: "desc" },
        ],
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      prisma.professional.count({ where }),
    ])

    return { professionals, total }
  }

  async create(data: Prisma.ProfessionalCreateInput) {
    const professional = await prisma.professional.create({
      data,
    })

    return professional
  }

  async update(id: string, data: Prisma.ProfessionalUpdateInput) {
    const professional = await prisma.professional.update({
      where: { id },
      data,
    })

    return professional
  }

  async count() {
    const count = await prisma.professional.count()
    return count
  }

  async delete(id: string) {
    await prisma.professional.delete({
      where: { id },
    })
  }
}


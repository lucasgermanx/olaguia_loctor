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
    const andConditions: Prisma.ProfessionalWhereInput[] = []

    // Filtro de ativo
    if (active !== undefined) {
      where.active = active
    }

    // Filtro de destaque
    if (featured !== undefined) {
      where.featured = featured
    }

    // Filtro de cidade (busca na cidade principal E nas cidades adicionais)
    if (city) {
      andConditions.push({
        OR: [
          {
            city: {
              contains: city,
              mode: "insensitive",
            }
          },
          {
            additional_cities: {
              // Verifica se dentro do array existe algum objeto com essa cidade exata
              array_contains: [{ city: city }] 
            },
          },
        ]
      })
    }

    // Filtro de especialidade
    if (specialty) {
      where.title = {
        contains: specialty,
        mode: "insensitive",
      }
    }

    // Busca por texto
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { bio: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ]
      })
    }

    // Combinar condições AND se houver
    if (andConditions.length > 0) {
      where.AND = andConditions
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


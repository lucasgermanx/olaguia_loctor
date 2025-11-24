import type { Prisma, Ad } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { AdsRepository } from "@/repositories/ads-repository"

export class PrismaAdsRepository implements AdsRepository {
  async findById(id: string) {
    const ad = await prisma.ad.findUnique({
      where: { id },
    })

    return ad
  }

  async findByPosition(position: string) {
    const ad = await prisma.ad.findFirst({
      where: {
        position: position as any,
        active: true,
      },
    })

    return ad
  }

  async findMany() {
    const ads = await prisma.ad.findMany({
      orderBy: [
        { order: "asc" },
        { created_at: "desc" },
      ],
    })

    return ads
  }

  async findActive() {
    const ads = await prisma.ad.findMany({
      where: { active: true },
      orderBy: [
        { order: "asc" },
        { created_at: "desc" },
      ],
    })

    return ads
  }

  async create(data: Prisma.AdUncheckedCreateInput) {
    const ad = await prisma.ad.create({
      data,
    })

    return ad
  }

  async update(id: string, data: Prisma.AdUpdateInput) {
    const ad = await prisma.ad.update({
      where: { id },
      data,
    })

    return ad
  }

  async delete(id: string) {
    await prisma.ad.delete({
      where: { id },
    })
  }
}


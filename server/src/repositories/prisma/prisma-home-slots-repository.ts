import type { Prisma, HomeSlot } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { HomeSlotsRepository } from "@/repositories/home-slots-repository"

export class PrismaHomeSlotsRepository implements HomeSlotsRepository {
  async findById(id: string) {
    const slot = await prisma.homeSlot.findUnique({
      where: { id },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    })

    return slot
  }

  async findBySectionAndPosition(section: string, position: string, slotIndex?: number) {
    const slot = await prisma.homeSlot.findFirst({
      where: {
        section,
        position,
        slot_index: slotIndex ?? null,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    })

    return slot
  }

  async findMany() {
    const slots = await prisma.homeSlot.findMany({
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: [
        { section: "asc" },
        { position: "asc" },
        { slot_index: "asc" },
        { order: "asc" },
      ],
    })

    return slots
  }

  async findBySection(section: string) {
    const slots = await prisma.homeSlot.findMany({
      where: { section },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: [
        { position: "asc" },
        { slot_index: "asc" },
        { order: "asc" },
      ],
    })

    return slots
  }

  async create(data: Prisma.HomeSlotUncheckedCreateInput) {
    const slot = await prisma.homeSlot.create({
      data,
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    })

    return slot
  }

  async update(id: string, data: Prisma.HomeSlotUpdateInput) {
    const slot = await prisma.homeSlot.update({
      where: { id },
      data,
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    })

    return slot
  }

  async delete(id: string) {
    await prisma.homeSlot.delete({
      where: { id },
    })
  }

  async assignPost(slotId: string, postId: string | null) {
    const slot = await prisma.homeSlot.update({
      where: { id: slotId },
      data: { post_id: postId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    })

    return slot
  }
}


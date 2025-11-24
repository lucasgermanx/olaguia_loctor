import type { Prisma, HomeSlot } from "@prisma/client"

export interface HomeSlotsRepository {
  findById(id: string): Promise<HomeSlot | null>
  findBySectionAndPosition(section: string, position: string, slotIndex?: number): Promise<HomeSlot | null>
  findMany(): Promise<HomeSlot[]>
  findBySection(section: string): Promise<HomeSlot[]>
  create(data: Prisma.HomeSlotUncheckedCreateInput): Promise<HomeSlot>
  update(id: string, data: Prisma.HomeSlotUpdateInput): Promise<HomeSlot>
  delete(id: string): Promise<void>
  assignPost(slotId: string, postId: string | null): Promise<HomeSlot>
}


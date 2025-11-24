import type { HomeSlotsRepository } from "@/repositories/home-slots-repository"
import type { HomeSlot } from "@prisma/client"

interface ListHomeSlotsUseCaseResponse {
  slots: HomeSlot[]
}

export class ListHomeSlotsUseCase {
  constructor(private homeSlotsRepository: HomeSlotsRepository) {}

  async execute(section?: string): Promise<ListHomeSlotsUseCaseResponse> {
    try {
      const slots = section
        ? await this.homeSlotsRepository.findBySection(section)
        : await this.homeSlotsRepository.findMany()

      return { slots }
    } catch (error: any) {
      // Se a tabela não existir, retornar array vazio em vez de erro
      if (error?.message?.includes("does not exist") || error?.code === "P2021") {
        console.warn("HomeSlot table does not exist yet. Run migration first.")
        return { slots: [] }
      }
      throw error
    }
  }
}


import type { Professional } from "@prisma/client"
import type { ProfessionalsRepository } from "@/repositories/professionals-repository"

interface ListProfessionalsUseCaseRequest {
  page: number
  per_page: number
  city?: string
  specialty?: string
  search?: string
  active?: boolean
  featured?: boolean
}

interface ListProfessionalsUseCaseResponse {
  professionals: Professional[]
  total: number
}

export class ListProfessionalsUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    page,
    per_page,
    city,
    specialty,
    search,
    active,
    featured,
  }: ListProfessionalsUseCaseRequest): Promise<ListProfessionalsUseCaseResponse> {
    const { professionals, total } = await this.professionalsRepository.findMany({
      page,
      per_page,
      city,
      specialty,
      search,
      active,
      featured,
    })

    return { professionals, total }
  }
}


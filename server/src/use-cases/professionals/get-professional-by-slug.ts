import type { Professional } from "@prisma/client"
import type { ProfessionalsRepository } from "@/repositories/professionals-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

interface GetProfessionalBySlugUseCaseRequest {
  slug: string
}

interface GetProfessionalBySlugUseCaseResponse {
  professional: Professional
}

export class GetProfessionalBySlugUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    slug,
  }: GetProfessionalBySlugUseCaseRequest): Promise<GetProfessionalBySlugUseCaseResponse> {
    const professional = await this.professionalsRepository.findBySlug(slug)

    if (!professional) {
      throw new ResourceNotFoundError()
    }

    return { professional }
  }
}


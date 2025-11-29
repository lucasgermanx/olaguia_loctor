import type { Professional } from "@prisma/client"
import type { ProfessionalsRepository } from "@/repositories/professionals-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

interface GetProfessionalByIdUseCaseRequest {
  id: string
}

interface GetProfessionalByIdUseCaseResponse {
  professional: Professional
}

export class GetProfessionalByIdUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    id,
  }: GetProfessionalByIdUseCaseRequest): Promise<GetProfessionalByIdUseCaseResponse> {
    const professional = await this.professionalsRepository.findById(id)

    if (!professional) {
      throw new ResourceNotFoundError()
    }

    return { professional }
  }
}


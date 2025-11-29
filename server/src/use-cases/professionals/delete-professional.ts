import type { ProfessionalsRepository } from "@/repositories/professionals-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

interface DeleteProfessionalUseCaseRequest {
  id: string
}

export class DeleteProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({ id }: DeleteProfessionalUseCaseRequest): Promise<void> {
    const professional = await this.professionalsRepository.findById(id)

    if (!professional) {
      throw new ResourceNotFoundError()
    }

    await this.professionalsRepository.delete(id)
  }
}


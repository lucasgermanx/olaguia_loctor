import type { AdsRepository } from "@/repositories/ads-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface DeleteAdUseCaseRequest {
  id: string
}

export class DeleteAdUseCase {
  constructor(private adsRepository: AdsRepository) {}

  async execute({ id }: DeleteAdUseCaseRequest): Promise<void> {
    const ad = await this.adsRepository.findById(id)

    if (!ad) {
      throw new ResourceNotFoundError()
    }

    await this.adsRepository.delete(id)
  }
}


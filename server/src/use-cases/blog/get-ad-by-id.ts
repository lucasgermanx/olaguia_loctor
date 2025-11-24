import type { AdsRepository } from "@/repositories/ads-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Ad } from "@prisma/client"

interface GetAdByIdUseCaseRequest {
  id: string
}

interface GetAdByIdUseCaseResponse {
  ad: Ad
}

export class GetAdByIdUseCase {
  constructor(private adsRepository: AdsRepository) {}

  async execute({ id }: GetAdByIdUseCaseRequest): Promise<GetAdByIdUseCaseResponse> {
    const ad = await this.adsRepository.findById(id)

    if (!ad) {
      throw new ResourceNotFoundError()
    }

    return { ad }
  }
}


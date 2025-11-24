import type { AdsRepository } from "@/repositories/ads-repository"
import type { Ad } from "@prisma/client"

interface ListAdsUseCaseResponse {
  ads: Ad[]
}

export class ListAdsUseCase {
  constructor(private adsRepository: AdsRepository) {}

  async execute(activeOnly: boolean = false): Promise<ListAdsUseCaseResponse> {
    const ads = activeOnly
      ? await this.adsRepository.findActive()
      : await this.adsRepository.findMany()

    return { ads }
  }
}


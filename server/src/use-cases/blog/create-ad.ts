import type { AdsRepository } from "@/repositories/ads-repository"
import type { Ad } from "@prisma/client"

interface CreateAdUseCaseRequest {
  title: string
  image_url: string
  link_url?: string
  position: string
  active?: boolean
  order?: number
}

interface CreateAdUseCaseResponse {
  ad: Ad
}

export class CreateAdUseCase {
  constructor(private adsRepository: AdsRepository) {}

  async execute({
    title,
    image_url,
    link_url,
    position,
    active = true,
    order = 0,
  }: CreateAdUseCaseRequest): Promise<CreateAdUseCaseResponse> {
    // Check if there's already an ad in this position
    const existingAd = await this.adsRepository.findByPosition(position)
    if (existingAd) {
      throw new Error("Já existe um anúncio ativo nesta posição")
    }

    const ad = await this.adsRepository.create({
      title,
      image_url,
      link_url: link_url || "#",
      position: position as any,
      active,
      order,
    })

    return { ad }
  }
}


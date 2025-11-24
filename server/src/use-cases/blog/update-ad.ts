import type { AdsRepository } from "@/repositories/ads-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Ad } from "@prisma/client"

interface UpdateAdUseCaseRequest {
  id: string
  title?: string
  image_url?: string
  link_url?: string
  position?: string
  active?: boolean
  order?: number
}

interface UpdateAdUseCaseResponse {
  ad: Ad
}

export class UpdateAdUseCase {
  constructor(private adsRepository: AdsRepository) {}

  async execute({
    id,
    title,
    image_url,
    link_url,
    position,
    active,
    order,
  }: UpdateAdUseCaseRequest): Promise<UpdateAdUseCaseResponse> {
    const adExists = await this.adsRepository.findById(id)
    if (!adExists) {
      throw new ResourceNotFoundError()
    }

    // If changing position, check if another ad is already in that position
    if (position && position !== adExists.position) {
      const existingAd = await this.adsRepository.findByPosition(position)
      if (existingAd && existingAd.id !== id) {
        throw new Error("Já existe um anúncio ativo nesta posição")
      }
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (image_url) updateData.image_url = image_url
    if (link_url !== undefined) updateData.link_url = link_url
    if (position) updateData.position = position as any
    if (active !== undefined) updateData.active = active
    if (order !== undefined) updateData.order = order

    const ad = await this.adsRepository.update(id, updateData)

    return { ad }
  }
}


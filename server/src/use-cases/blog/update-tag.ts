import type { TagsRepository } from "@/repositories/tags-repository"
import type { Tag } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface UpdateTagUseCaseRequest {
  id: string
  name: string
  slug: string
  color?: string
}

interface UpdateTagUseCaseResponse {
  tag: Tag
}

export class UpdateTagUseCase {
  constructor(private tagsRepository: TagsRepository) {}

  async execute({ id, name, slug, color }: UpdateTagUseCaseRequest): Promise<UpdateTagUseCaseResponse> {
    const existingTag = await this.tagsRepository.findById(id)

    if (!existingTag) {
      throw new ResourceNotFoundError()
    }

    const tag = await this.tagsRepository.update(id, {
      name,
      slug,
      color,
    })

    return { tag }
  }
}

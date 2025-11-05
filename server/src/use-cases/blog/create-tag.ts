import type { TagsRepository } from "@/repositories/tags-repository"
import type { Tag } from "@prisma/client"

interface CreateTagUseCaseRequest {
  name: string
  slug: string,
  color: string
}

interface CreateTagUseCaseResponse {
  tag: Tag
}

export class CreateTagUseCase {
  constructor(private tagsRepository: TagsRepository) { }

  async execute({ name, slug, color }: CreateTagUseCaseRequest): Promise<CreateTagUseCaseResponse> {
    const tag = await this.tagsRepository.create({
      name,
      slug,
      color
    })

    return { tag }
  }
}

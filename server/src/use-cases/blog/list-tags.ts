import type { TagsRepository } from "@/repositories/tags-repository"
import type { Tag } from "@prisma/client"

interface ListTagsUseCaseResponse {
  tags: Tag[]
}

export class ListTagsUseCase {
  constructor(private tagsRepository: TagsRepository) {}

  async execute(): Promise<ListTagsUseCaseResponse> {
    const tags = await this.tagsRepository.findMany()

    return { tags }
  }
}

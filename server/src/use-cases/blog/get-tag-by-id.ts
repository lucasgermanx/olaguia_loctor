import type { TagsRepository } from "@/repositories/tags-repository"
import type { Tag } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface GetTagByIdUseCaseRequest {
  id: string
}

interface GetTagByIdUseCaseResponse {
  tag: Tag
}

export class GetTagByIdUseCase {
  constructor(private tagsRepository: TagsRepository) {}

  async execute({ id }: GetTagByIdUseCaseRequest): Promise<GetTagByIdUseCaseResponse> {
    const tag = await this.tagsRepository.findById(id)

    if (!tag) {
      throw new ResourceNotFoundError()
    }

    return { tag }
  }
}

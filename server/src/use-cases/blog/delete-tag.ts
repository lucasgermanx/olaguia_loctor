import type { TagsRepository } from "@/repositories/tags-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface DeleteTagUseCaseRequest {
  id: string
}

export class DeleteTagUseCase {
  constructor(private tagsRepository: TagsRepository) { }

  async execute({ id }: DeleteTagUseCaseRequest): Promise<void> {
    const tag = await this.tagsRepository.findById(id)

    if (!tag) {
      throw new ResourceNotFoundError()
    }

    await this.tagsRepository.delete(id)
  }
}

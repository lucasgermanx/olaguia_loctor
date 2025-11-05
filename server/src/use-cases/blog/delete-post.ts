import type { PostsRepository } from "@/repositories/posts-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface DeletePostUseCaseRequest {
  id: string
}

export class DeletePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostUseCaseRequest): Promise<void> {
    const postExists = await this.postsRepository.findById(id)

    if (!postExists) {
      throw new ResourceNotFoundError()
    }

    await this.postsRepository.delete(id)
  }
}

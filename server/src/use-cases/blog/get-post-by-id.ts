import type { PostsRepository } from "@/repositories/posts-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Post } from "@prisma/client"

interface GetPostByIDUseCaseRequest {
  id: string
}

interface GetPostByIDUseCaseResponse {
  post: Post
}

export class GetPostByIDUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: GetPostByIDUseCaseRequest): Promise<GetPostByIDUseCaseResponse> {
    const post = await this.postsRepository.findById(id)

    if (!post) {
      throw new ResourceNotFoundError()
    }

    return { post }
  }
}

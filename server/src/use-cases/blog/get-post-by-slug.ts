import type { PostsRepository } from "@/repositories/posts-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import type { Post } from "@prisma/client"

interface GetPostBySlugUseCaseRequest {
  slug: string
}

interface GetPostBySlugUseCaseResponse {
  post: Post
}

export class GetPostBySlugUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ slug }: GetPostBySlugUseCaseRequest): Promise<GetPostBySlugUseCaseResponse> {
    const post = await this.postsRepository.findBySlug(slug)

    if (!post) {
      throw new ResourceNotFoundError()
    }

    return { post }
  }
}

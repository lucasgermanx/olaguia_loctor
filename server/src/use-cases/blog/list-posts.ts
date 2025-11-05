import type { PostsRepository } from "@/repositories/posts-repository"
import type { Post } from "@prisma/client"

interface ListPostsUseCaseRequest {
  page: number
  per_page: number
  category_slug?: string
  tag_slug?: string
  search?: string
}

interface ListPostsUseCaseResponse {
  posts: Post[]
  total: number
}

export class ListPostsUseCase {
  constructor(private postsRepository: PostsRepository) { }

  async execute({
    page,
    per_page,
    category_slug,
    tag_slug,
    search,
  }: ListPostsUseCaseRequest): Promise<ListPostsUseCaseResponse> {
    const { posts, total } = await this.postsRepository.findMany({
      page,
      per_page,
      category_slug,
      tag_slug,
      search,
    })

    return { posts, total }
  }
}

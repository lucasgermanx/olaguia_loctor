import type { PostsRepository } from "@/repositories/posts-repository"
import type { Post } from "@prisma/client"

interface ListPostsUseCaseRequest {
  page: number
  per_page: number
  category_slug?: string
  category_id?: string
  tag_slug?: string
  search?: string
  author_id?: string
  professional_id?: string
  published?: boolean
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
    category_id,
    tag_slug,
    search,
    author_id,
    professional_id,
    published,
  }: ListPostsUseCaseRequest): Promise<ListPostsUseCaseResponse> {
    const { posts, total } = await this.postsRepository.findMany({
      page,
      per_page,
      category_slug,
      category_id,
      tag_slug,
      search,
      author_id,
      professional_id,
      published,
    })

    return { posts, total }
  }
}

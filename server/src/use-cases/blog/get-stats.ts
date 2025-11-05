import type { PostsRepository } from "@/repositories/posts-repository"
import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { TagsRepository } from "@/repositories/tags-repository"
import type { UsersRepository } from "@/repositories/users-repository"

interface GetStatsUseCaseResponse {
  posts: number
  categories: number
  tags: number
  users: number
}

export class GetStatsUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private categoriesRepository: CategoriesRepository,
    private tagsRepository: TagsRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute(): Promise<GetStatsUseCaseResponse> {
    const [postsCount, categoriesCount, tagsCount, usersCount] = await Promise.all([
      this.postsRepository.count(),
      this.categoriesRepository.count(),
      this.tagsRepository.count(),
      this.usersRepository.count(),
    ])

    return {
      posts: postsCount,
      categories: categoriesCount,
      tags: tagsCount,
      users: usersCount,
    }
  }
}

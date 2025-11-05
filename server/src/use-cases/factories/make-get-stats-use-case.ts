import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository"
import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositories"
import { GetStatsUseCase } from "../blog/get-stats"

export function makeGetStatsUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const tagsRepository = new PrismaTagsRepository()
  const usersRepository = new PrismaUsersRepository()

  const getStatsUseCase = new GetStatsUseCase(postsRepository, categoriesRepository, tagsRepository, usersRepository)

  return getStatsUseCase
}

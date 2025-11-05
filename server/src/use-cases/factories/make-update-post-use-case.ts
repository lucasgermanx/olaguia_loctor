import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository"
import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { UpdatePostUseCase } from "../blog/update-post"

export function makeUpdatePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const tagsRepository = new PrismaTagsRepository()

  const useCase = new UpdatePostUseCase(postsRepository, categoriesRepository, tagsRepository)

  return useCase
}

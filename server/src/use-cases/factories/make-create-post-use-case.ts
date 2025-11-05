import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository"
import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { CreatePostUseCase } from "../blog/create-post"

export function makeCreatePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const tagsRepository = new PrismaTagsRepository()

  const useCase = new CreatePostUseCase(postsRepository, categoriesRepository, tagsRepository)

  return useCase
}

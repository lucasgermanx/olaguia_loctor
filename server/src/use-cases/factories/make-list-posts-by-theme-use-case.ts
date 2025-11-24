import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { ListPostsByThemeUseCase } from "../blog/list-posts-by-theme"

export function makeListPostsByThemeUseCase() {
  const postsRepository = new PrismaPostsRepository()

  const useCase = new ListPostsByThemeUseCase(postsRepository)

  return useCase
}


import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { ListPostsUseCase } from "../blog/list-posts"

export function makeListPostsUseCase() {
  const postsRepository = new PrismaPostsRepository()

  const useCase = new ListPostsUseCase(postsRepository)

  return useCase
}

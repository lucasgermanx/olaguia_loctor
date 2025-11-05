import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { DeletePostUseCase } from "../blog/delete-post"

export function makeDeletePostUseCase() {
  const postsRepository = new PrismaPostsRepository()

  const useCase = new DeletePostUseCase(postsRepository)

  return useCase
}

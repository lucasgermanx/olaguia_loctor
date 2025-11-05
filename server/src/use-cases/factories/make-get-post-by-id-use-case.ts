import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { GetPostByIDUseCase } from "../blog/get-post-by-id"

export function makeGetPostByIdUseCase() {
  const postsRepository = new PrismaPostsRepository()

  const useCase = new GetPostByIDUseCase(postsRepository)

  return useCase
}

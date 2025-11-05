import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { GetPostBySlugUseCase } from "../blog/get-post-by-slug"

export function makeGetPostBySlugUseCase() {
  const postsRepository = new PrismaPostsRepository()

  const useCase = new GetPostBySlugUseCase(postsRepository)

  return useCase
}

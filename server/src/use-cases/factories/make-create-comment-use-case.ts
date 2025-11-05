import { PrismaCommentsRepository } from "@/repositories/prisma/prisma-comments-repository"
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { CreateCommentUseCase } from "../blog/create-comment"

export function makeCreateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const postsRepository = new PrismaPostsRepository()

  const useCase = new CreateCommentUseCase(commentsRepository, postsRepository)

  return useCase
}

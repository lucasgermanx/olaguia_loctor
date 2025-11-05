import { PrismaCommentsRepository } from "@/repositories/prisma/prisma-comments-repository"
import { ListCommentsUseCase } from "../blog/list-comments"

export function makeListCommentsUseCase() {
  const commentsRepository = new PrismaCommentsRepository()

  const useCase = new ListCommentsUseCase(commentsRepository)

  return useCase
}

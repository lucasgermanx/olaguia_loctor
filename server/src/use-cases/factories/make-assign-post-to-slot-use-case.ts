import { PrismaHomeSlotsRepository } from "@/repositories/prisma/prisma-home-slots-repository"
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository"
import { AssignPostToSlotUseCase } from "../blog/assign-post-to-slot"

export function makeAssignPostToSlotUseCase() {
  const homeSlotsRepository = new PrismaHomeSlotsRepository()
  const postsRepository = new PrismaPostsRepository()

  const useCase = new AssignPostToSlotUseCase(homeSlotsRepository, postsRepository)

  return useCase
}


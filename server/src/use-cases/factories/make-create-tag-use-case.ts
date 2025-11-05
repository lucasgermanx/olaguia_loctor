import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { CreateTagUseCase } from "../blog/create-tag"

export function makeCreateTagUseCase() {
  const tagsRepository = new PrismaTagsRepository()

  const useCase = new CreateTagUseCase(tagsRepository)

  return useCase
}

import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { ListTagsUseCase } from "../blog/list-tags"

export function makeListTagsUseCase() {
  const tagsRepository = new PrismaTagsRepository()

  const useCase = new ListTagsUseCase(tagsRepository)

  return useCase
}

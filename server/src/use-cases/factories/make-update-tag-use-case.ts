import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { UpdateTagUseCase } from "../blog/update-tag"

export function makeUpdateTagUseCase() {
  const tagsRepository = new PrismaTagsRepository()
  const updateTagUseCase = new UpdateTagUseCase(tagsRepository)

  return updateTagUseCase
}

import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { DeleteTagUseCase } from "../blog/delete-tag"

export function makeDeleteTagUseCase() {
  const tagsRepository = new PrismaTagsRepository()
  const deleteTagUseCase = new DeleteTagUseCase(tagsRepository)

  return deleteTagUseCase
}

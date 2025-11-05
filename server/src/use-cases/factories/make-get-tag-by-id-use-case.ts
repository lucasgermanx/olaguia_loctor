import { PrismaTagsRepository } from "@/repositories/prisma/prisma-tags-repository"
import { GetTagByIdUseCase } from "../blog/get-tag-by-id"

export function makeGetTagByIdUseCase() {
  const tagsRepository = new PrismaTagsRepository()
  const getTagByIdUseCase = new GetTagByIdUseCase(tagsRepository)

  return getTagByIdUseCase
}

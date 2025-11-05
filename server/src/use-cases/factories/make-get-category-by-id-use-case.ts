import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository"
import { GetCategoryByIdUseCase } from "../blog/get-category-by-id"

export function makeGetCategoryByIdUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoriesRepository)

  return getCategoryByIdUseCase
}

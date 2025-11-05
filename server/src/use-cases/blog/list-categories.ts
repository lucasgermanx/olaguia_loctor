import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"

interface ListCategoriesUseCaseResponse {
  categories: Category[]
}

export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<ListCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findMany()

    return { categories }
  }
}

import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface GetCategoryByIdUseCaseRequest {
  id: string
}

interface GetCategoryByIdUseCaseResponse {
  category: Category
}

export class GetCategoryByIdUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id }: GetCategoryByIdUseCaseRequest): Promise<GetCategoryByIdUseCaseResponse> {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      throw new ResourceNotFoundError()
    }

    return { category }
  }
}

import type { CategoriesRepository } from "@/repositories/categories-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface DeleteCategoryUseCaseRequest {
  id: string
}

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id }: DeleteCategoryUseCaseRequest): Promise<void> {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      throw new ResourceNotFoundError()
    }

    await this.categoriesRepository.delete(id)
  }
}

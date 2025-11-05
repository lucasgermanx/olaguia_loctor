import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface UpdateCategoryUseCaseRequest {
  id: string
  name: string
  slug: string
  description?: string
}

interface UpdateCategoryUseCaseResponse {
  category: Category
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id, name, slug, description }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const existingCategory = await this.categoriesRepository.findById(id)

    if (!existingCategory) {
      throw new ResourceNotFoundError()
    }

    const category = await this.categoriesRepository.update(id, {
      name,
      slug,
      description,
    })

    return { category }
  }
}

import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"

interface CreateCategoryUseCaseRequest {
  name: string
  slug: string
  description?: string
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ name, slug, description }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.create({
      name,
      slug,
      description,
    })

    return { category }
  }
}

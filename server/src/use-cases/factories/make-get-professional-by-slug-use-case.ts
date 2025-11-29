import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { GetProfessionalBySlugUseCase } from "../professionals/get-professional-by-slug"

export function makeGetProfessionalBySlugUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new GetProfessionalBySlugUseCase(professionalsRepository)

  return useCase
}


import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { GetProfessionalByIdUseCase } from "../professionals/get-professional-by-id"

export function makeGetProfessionalByIdUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new GetProfessionalByIdUseCase(professionalsRepository)

  return useCase
}


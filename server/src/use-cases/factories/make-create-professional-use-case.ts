import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { CreateProfessionalUseCase } from "../professionals/create-professional"

export function makeCreateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new CreateProfessionalUseCase(professionalsRepository)

  return useCase
}


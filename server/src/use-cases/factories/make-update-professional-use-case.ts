import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { UpdateProfessionalUseCase } from "../professionals/update-professional"

export function makeUpdateProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new UpdateProfessionalUseCase(professionalsRepository)

  return useCase
}


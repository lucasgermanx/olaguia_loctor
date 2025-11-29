import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { DeleteProfessionalUseCase } from "../professionals/delete-professional"

export function makeDeleteProfessionalUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new DeleteProfessionalUseCase(professionalsRepository)

  return useCase
}


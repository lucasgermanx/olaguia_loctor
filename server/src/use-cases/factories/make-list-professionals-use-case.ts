import { PrismaProfessionalsRepository } from "@/repositories/prisma/prisma-professionals-repository"
import { ListProfessionalsUseCase } from "../professionals/list-professionals"

export function makeListProfessionalsUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const useCase = new ListProfessionalsUseCase(professionalsRepository)

  return useCase
}


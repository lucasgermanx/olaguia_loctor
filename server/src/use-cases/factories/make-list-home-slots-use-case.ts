import { PrismaHomeSlotsRepository } from "@/repositories/prisma/prisma-home-slots-repository"
import { ListHomeSlotsUseCase } from "../blog/list-home-slots"

export function makeListHomeSlotsUseCase() {
  const homeSlotsRepository = new PrismaHomeSlotsRepository()

  const useCase = new ListHomeSlotsUseCase(homeSlotsRepository)

  return useCase
}


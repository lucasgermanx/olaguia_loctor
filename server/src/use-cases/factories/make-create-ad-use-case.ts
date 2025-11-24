import { PrismaAdsRepository } from "@/repositories/prisma/prisma-ads-repository"
import { CreateAdUseCase } from "../blog/create-ad"

export function makeCreateAdUseCase() {
  const adsRepository = new PrismaAdsRepository()

  const useCase = new CreateAdUseCase(adsRepository)

  return useCase
}


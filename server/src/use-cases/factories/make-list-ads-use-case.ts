import { PrismaAdsRepository } from "@/repositories/prisma/prisma-ads-repository"
import { ListAdsUseCase } from "../blog/list-ads"

export function makeListAdsUseCase() {
  const adsRepository = new PrismaAdsRepository()

  const useCase = new ListAdsUseCase(adsRepository)

  return useCase
}


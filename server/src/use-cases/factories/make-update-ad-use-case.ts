import { PrismaAdsRepository } from "@/repositories/prisma/prisma-ads-repository"
import { UpdateAdUseCase } from "../blog/update-ad"

export function makeUpdateAdUseCase() {
  const adsRepository = new PrismaAdsRepository()

  const useCase = new UpdateAdUseCase(adsRepository)

  return useCase
}


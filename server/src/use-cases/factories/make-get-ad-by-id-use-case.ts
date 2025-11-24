import { PrismaAdsRepository } from "@/repositories/prisma/prisma-ads-repository"
import { GetAdByIdUseCase } from "../blog/get-ad-by-id"

export function makeGetAdByIdUseCase() {
  const adsRepository = new PrismaAdsRepository()

  const useCase = new GetAdByIdUseCase(adsRepository)

  return useCase
}


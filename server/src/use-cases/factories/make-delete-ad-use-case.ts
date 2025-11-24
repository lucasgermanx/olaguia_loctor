import { PrismaAdsRepository } from "@/repositories/prisma/prisma-ads-repository"
import { DeleteAdUseCase } from "../blog/delete-ad"

export function makeDeleteAdUseCase() {
  const adsRepository = new PrismaAdsRepository()

  const useCase = new DeleteAdUseCase(adsRepository)

  return useCase
}


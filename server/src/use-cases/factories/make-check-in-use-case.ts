import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repositories";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repositories";
import { CheckInUseCase } from "../checkin";

export function makeCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const gymsRepository = new PrismaGymsRepository()
  
    const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)
  
    return useCase
  }

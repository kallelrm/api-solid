import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInService } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCheckInsService() {
  const gymsRepository = new PrismaGymsRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new CheckInService(checkInsRepository, gymsRepository)

  return service
}

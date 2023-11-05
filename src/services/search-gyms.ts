import type { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymServiceRequest {
  query: string
  page: number
}

interface SearchGymUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymServiceRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}

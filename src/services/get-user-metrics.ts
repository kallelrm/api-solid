import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsServiceRequest {
  userId: string
}

interface GetUserMetricsServiceResponse {
  metrics: number
}

export class GetUserMetricsService {
  constructor(private checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const metrics = await this.checkinRepository.findByUserId(userId)

    return { metrics }
  }
}

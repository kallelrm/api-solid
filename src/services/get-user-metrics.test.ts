import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { GetUserMetricsService } from './get-user-metrics'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: CheckInsRepository
let sut: GetUserMetricsService

describe('Get User Metrics service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })
  test('Should be able to get user metrics', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym${i}`,
        user_id: 'user01',
      })
    }

    const { metrics } = await sut.execute({ userId: 'user01' })

    expect(metrics).toBe(22)
  })
})

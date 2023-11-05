/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { FetchUserCheckInHistoryService } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInHistoryService

describe('Fetch user check-in history Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInHistoryService(checkInsRepository)
  })

  test('Should be able to retrieve user check ins', async () => {
    await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    })
    await checkInsRepository.create({
      gym_id: 'gym02',
      user_id: 'user01',
    })
    const { checkIns } = await sut.execute({
      userId: 'user01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym01' }),
      expect.objectContaining({ gym_id: 'gym02' }),
    ])
  })

  test('Should be able to fetch paginated check in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym${i}`,
        user_id: 'user01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym21' }),
      expect.objectContaining({ gym_id: 'gym22' }),
    ])
  })
})

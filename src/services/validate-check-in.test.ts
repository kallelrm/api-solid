/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest'
import { ValidateCheckInService } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate Checkin Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  test('Should not be able to validate an inexistent check-in', async () => {
    expect(async () => {
      await sut.execute({
        checkInId: '212321312',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  test('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutes = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutes)

    expect(
      async () =>
        await sut.execute({
          checkInId: createdCheckIn.id,
        }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})

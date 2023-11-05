/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Register Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'ids-de-test',
      title: 'js gym',
      phone: '',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'ids-de-test',
      userId: 'ids-de-test',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.gym_id).toEqual('ids-de-test')
    expect(checkIn.user_id).toEqual('ids-de-test')
  })

  test('Should not able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'ids-de-test',
      userId: 'ids-de-test',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: 'ids-de-test',
        userId: 'ids-de-test',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  test('Should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'ids-de-test',
      userId: 'ids-de-test',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'ids-de-test',
      userId: 'ids-de-test',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('Should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym2',
      title: 'js gym',
      phone: '',
      description: '',
      latitude: new Decimal(-29.6368911),
      longitude: new Decimal(-53.1952068),
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym2',
        userId: 'ids-de-test',
        userLatitude: -29.6857123,
        userLongitude: -53.7699111,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

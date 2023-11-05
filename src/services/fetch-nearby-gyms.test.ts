/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Register Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  test('Should be able to search for nearby gyms', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        id: `gym${i}`,
        title: `js gym ${i}`,
        description: null,
        phone: null,
        latitude: Number(`0.6${i}36`),
        longitude: Number(`0.1${i}95`),
      })
    }

    await gymsRepository.create({
      id: `gym22`,
      title: `js gym 22`,
      description: null,
      phone: null,
      latitude: Number(`-24`),
      longitude: Number(`-56`),
    })

    const { gyms } = await sut.execute({
      userLatitude: 0.6368112,
      userLongitude: 0.1952681,
    })
    expect(gyms.length).toBeGreaterThan(2)
  })
})

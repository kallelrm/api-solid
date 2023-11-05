/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  test('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'js gym',
      description: null,
      phone: null,
      latitude: -29.6368911,
      longitude: -53.1952068,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})

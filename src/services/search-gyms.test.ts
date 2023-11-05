/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test, describe, beforeEach } from 'vitest'
import { SearchGymService } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymService(gymsRepository)
  })

  test('Should be able search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym01',
      title: 'js gym',
      description: null,
      phone: null,
      latitude: -29.6368911,
      longitude: -53.1952068,
    })
    await gymsRepository.create({
      id: 'gym02',
      title: 'ts gym',
      description: null,
      phone: null,
      latitude: -29.6368511,
      longitude: -53.1958068,
    })

    const { gyms } = await sut.execute({ query: 'js', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'js gym' })])
  })

  test('Should be able to search for paginated gyms', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        id: `gym${i}`,
        title: `js gym ${i}`,
        description: null,
        phone: null,
        latitude: i,
        longitude: Number(`-53.${i}`),
      })
    }

    const { gyms } = await sut.execute({ query: 'js gym', page: 2 })

    expect.soft(gyms).toHaveLength(2)
    expect
      .soft(gyms)
      .toEqual([
        expect.objectContaining({ title: 'js gym 20' }),
        expect.objectContaining({ title: 'js gym 21' }),
      ])
  })
})

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  test('Should be able to get user profile', async () => {
    const { id } = await usersRepository.create({
      name: 'kallel',
      email: 'kallel@roman.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('kallel')
  })

  test('Should not be able to with wrong id', async () => {
    await usersRepository.create({
      name: 'kallel',
      email: 'kallel@roman.com',
      password_hash: await hash('123456', 6),
    })
    expect(async () => {
      await sut.execute({ userId: '1' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

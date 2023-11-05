/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  test('Should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'kallel',
      email: 'kallel@roman.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'kallel@roman.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('Should not be able to with wrong email', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'kallel@roman.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  test('Should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'kallel',
      email: 'kallel@roman.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      async () =>
        await sut.execute({
          email: 'kallel@roman.com',
          password: '123123',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

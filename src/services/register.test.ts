/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  test('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'kallel',
      email: 'email4@kallel.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('Should not be able to register the same email twice', async () => {
    const email = 'email5@kallel.com'

    await sut.execute({
      name: 'kallel',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'kallel',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  test('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'kallel',
      email: 'email8@kallel.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
})

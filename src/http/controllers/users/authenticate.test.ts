import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'kallel',
      email: 'kallel@kallel.com',
      password: '123456',
    })

    const response = await request(app.server).post('/session').send({
      email: 'kallel@kallel.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toMatchObject({ token: expect.any(String) })
  })
})

import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get the count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'gym js',
        description: 'gym of js devs',
        phone: '+5511123456789',
        latitude: 5.000001,
        longitude: 5.000001,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
          validated_at: new Date(),
        },
        {
          gym_id: gym.id,
          user_id: user.id,
          validated_at: new Date(),
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/metric`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.metrics).toEqual(2)
  })
})

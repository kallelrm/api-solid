import { makeCheckInsService } from '@/services/factories/make-check-in-service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(req.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

  const checkInService = makeCheckInsService()

  await checkInService.execute({
    gymId,
    userId: req.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return res.status(201).send()
}

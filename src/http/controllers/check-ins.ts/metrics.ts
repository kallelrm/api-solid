import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'

export async function metrics(req: FastifyRequest, res: FastifyReply) {
  const getUserMetricsService = makeGetUserMetricsService()

  const { metrics } = await getUserMetricsService.execute({
    userId: req.user.sub,
  })
  return res.status(200).send({ metrics })
}

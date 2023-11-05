import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchGymService } from '@/services/factories/make-search-gym-service'

export async function search(req: FastifyRequest, res: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsQuerySchema.parse(req.query)

  const searchGymService = makeSearchGymService()

  const { gyms } = await searchGymService.execute({
    query,
    page,
  })
  return res.status(200).send({ gyms })
}

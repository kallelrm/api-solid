import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(req.params)

  const validateCheckInService = makeValidateCheckInService()
  await validateCheckInService.execute({
    checkInId,
  })
  return res.status(204).send()
}

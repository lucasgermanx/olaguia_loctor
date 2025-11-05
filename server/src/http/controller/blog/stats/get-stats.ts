import type { FastifyRequest, FastifyReply } from "fastify"
import { makeGetStatsUseCase } from "@/use-cases/factories/make-get-stats-use-case"

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getStatsUseCase = makeGetStatsUseCase()
    console.log(getStatsUseCase)
    const stats = await getStatsUseCase.execute()

    return reply.status(200).send(stats)
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error fetching stats" })
  }
}

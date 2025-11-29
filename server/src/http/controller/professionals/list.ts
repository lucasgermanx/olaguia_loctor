import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeListProfessionalsUseCase } from "@/use-cases/factories/make-list-professionals-use-case"

export async function listProfessionals(request: FastifyRequest, reply: FastifyReply) {
  const listProfessionalsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(100).default(10),
    city: z.string().optional(),
    specialty: z.string().optional(),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
  })

  const { page, per_page, city, specialty, search, active, featured } = listProfessionalsQuerySchema.parse(request.query)

  try {
    const listProfessionalsUseCase = makeListProfessionalsUseCase()

    const { professionals, total } = await listProfessionalsUseCase.execute({
      page,
      per_page,
      city,
      specialty,
      search,
      active,
      featured,
    })

    return reply.status(200).send({
      professionals,
      meta: {
        total,
        page,
        per_page,
        total_pages: Math.ceil(total / per_page),
      },
    })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing professionals" })
  }
}


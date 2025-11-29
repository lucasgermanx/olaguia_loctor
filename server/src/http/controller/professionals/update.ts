import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeUpdateProfessionalUseCase } from "@/use-cases/factories/make-update-professional-use-case"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export async function updateProfessional(request: FastifyRequest, reply: FastifyReply) {
  const updateProfessionalParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateProfessionalBodySchema = z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    title: z.string().optional(),
    specialty: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    cover_image: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    working_hours: z.string().optional(),
    specialties: z.any().optional(),
    services: z.any().optional(),
    testimonials: z.any().optional(),
    faqs: z.any().optional(),
    gallery_images: z.any().optional(),
    social_facebook: z.string().optional(),
    social_instagram: z.string().optional(),
    social_linkedin: z.string().optional(),
    social_twitter: z.string().optional(),
    social_youtube: z.string().optional(),
    social_whatsapp: z.string().optional(),
    active: z.boolean().optional(),
    featured: z.boolean().optional(),
  })

  const { id } = updateProfessionalParamsSchema.parse(request.params)
  const data = updateProfessionalBodySchema.parse(request.body)

  try {
    const updateProfessionalUseCase = makeUpdateProfessionalUseCase()

    const { professional } = await updateProfessionalUseCase.execute({
      id,
      ...data,
    })

    return reply.status(200).send({ professional })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Professional not found" })
    }

    console.error(err)
    return reply.status(500).send({ message: "Error updating professional" })
  }
}


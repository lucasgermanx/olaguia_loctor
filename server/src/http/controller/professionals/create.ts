import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateProfessionalUseCase } from "@/use-cases/factories/make-create-professional-use-case"

export async function createProfessional(request: FastifyRequest, reply: FastifyReply) {
  const createProfessionalBodySchema = z.object({
    name: z.string(),
    slug: z.string(),
    register: z.string().optional(),
    title: z.string(),
    specialty: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    cover_image: z.string().optional(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
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

  const data = createProfessionalBodySchema.parse(request.body)

  try {
    const createProfessionalUseCase = makeCreateProfessionalUseCase()

    const { professional } = await createProfessionalUseCase.execute(data)

    return reply.status(201).send({ professional })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error creating professional" })
  }
}


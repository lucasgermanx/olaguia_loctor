import type { Professional } from "@prisma/client"
import type { ProfessionalsRepository } from "@/repositories/professionals-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

interface UpdateProfessionalUseCaseRequest {
  id: string
  name?: string
  slug?: string
  title?: string
  specialty?: string
  bio?: string
  avatar?: string
  cover_image?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  additional_cities?: any // Array de cidades adicionais: [{city, state}]
  working_hours?: string
  specialties?: any
  services?: any
  testimonials?: any
  faqs?: any
  gallery_images?: any
  // Campos da seção "Dores do Cliente"
  pain_points_title?: string
  pain_points_subtitle?: string
  pain_points_image?: string
  pain_points?: any
  // Campos da seção de Serviços
  services_section_title?: string
  services_section_subtitle?: string
  social_facebook?: string
  social_instagram?: string
  social_linkedin?: string
  social_twitter?: string
  social_youtube?: string
  social_whatsapp?: string
  active?: boolean
  featured?: boolean
}

interface UpdateProfessionalUseCaseResponse {
  professional: Professional
}

export class UpdateProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    id,
    ...data
  }: UpdateProfessionalUseCaseRequest): Promise<UpdateProfessionalUseCaseResponse> {
    const professionalExists = await this.professionalsRepository.findById(id)

    if (!professionalExists) {
      throw new ResourceNotFoundError()
    }

    const professional = await this.professionalsRepository.update(id, data)

    return { professional }
  }
}


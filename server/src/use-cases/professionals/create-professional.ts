import type { Professional } from "@prisma/client"
import type { ProfessionalsRepository } from "@/repositories/professionals-repository"

interface CreateProfessionalUseCaseRequest {
  name: string
  slug: string
  title: string
  specialty: string
  bio: string
  avatar?: string
  cover_image?: string
  email: string
  phone: string
  address: string
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

interface CreateProfessionalUseCaseResponse {
  professional: Professional
}

export class CreateProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    name,
    slug,
    title,
    specialty,
    bio,
    avatar,
    cover_image,
    email,
    phone,
    address,
    city,
    state,
    additional_cities,
    working_hours,
    specialties,
    services,
    testimonials,
    faqs,
    gallery_images,
    pain_points_title,
    pain_points_subtitle,
    pain_points_image,
    pain_points,
    services_section_title,
    services_section_subtitle,
    social_facebook,
    social_instagram,
    social_linkedin,
    social_twitter,
    social_youtube,
    social_whatsapp,
    active = true,
    featured = false,
  }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse> {
    const professional = await this.professionalsRepository.create({
      name,
      slug,
      title,
      specialty,
      bio,
      avatar,
      cover_image,
      email,
      phone,
      address,
      city,
      state,
      additional_cities,
      working_hours,
      specialties,
      services,
      testimonials,
      faqs,
      gallery_images,
      pain_points_title,
      pain_points_subtitle,
      pain_points_image,
      pain_points,
      services_section_title,
      services_section_subtitle,
      social_facebook,
      social_instagram,
      social_linkedin,
      social_twitter,
      social_youtube,
      social_whatsapp,
      active,
      featured,
    })

    return { professional }
  }
}


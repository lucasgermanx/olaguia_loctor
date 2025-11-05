import { SiteSettingsRepository } from "@/repositories/site-settings-repository"

interface GetSiteSettingsUseCaseResponse {
    settings: {
        id: string
        site_name: string
        site_description: string | null
        primary_color: string
        secondary_color: string
        accent_color: string
        logo_url: string | null
        favicon_url: string | null
        hero_title: string | null
        hero_subtitle: string | null
        footer_text: string | null
        contact_email: string | null
        contact_phone: string | null
        social_facebook: string | null
        social_instagram: string | null
        social_linkedin: string | null
        social_twitter: string | null
        google_analytics: string | null
        meta_keywords: string | null
        meta_description: string | null
    }
}

export class GetSiteSettingsUseCase {
    constructor(private siteSettingsRepository: SiteSettingsRepository) { }

    async execute(): Promise<GetSiteSettingsUseCaseResponse> {
        let settings = await this.siteSettingsRepository.findFirst()

        if (!settings) {
            // Criar configurações padrão se não existirem
            settings = await this.siteSettingsRepository.create({
                site_name: "Blog Loctor",
                site_description: "Blog oficial da Loctor",
                primary_color: "#2563eb",
                secondary_color: "#1e40af",
                accent_color: "#f59e0b",
                logo_url: null,
                favicon_url: null,
                hero_title: "Bem-vindo ao Blog Loctor",
                hero_subtitle: "Descubra insights valiosos sobre tecnologia e inovação",
                footer_text: "© 2024 Blog Loctor. Todos os direitos reservados.",
                contact_email: null,
                contact_phone: null,
                social_facebook: null,
                social_instagram: null,
                social_linkedin: null,
                social_twitter: null,
                google_analytics: null,
                meta_keywords: null,
                meta_description: null,
            })
        }

        return { settings }
    }
} 
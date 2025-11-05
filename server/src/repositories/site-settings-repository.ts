import type { SiteSettings } from "@prisma/client"

export interface SiteSettingsRepository {
    findFirst(): Promise<SiteSettings | null>
    create(data: Omit<SiteSettings, "id" | "created_at" | "updated_at">): Promise<SiteSettings>
    update(id: string, data: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>): Promise<SiteSettings>
    upsert(data: Omit<SiteSettings, "id" | "created_at" | "updated_at">): Promise<SiteSettings>
} 
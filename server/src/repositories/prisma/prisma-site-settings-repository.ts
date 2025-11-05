import { prisma } from "@/lib/prisma"
import { SiteSettingsRepository } from "@/repositories/site-settings-repository"

export class PrismaSiteSettingsRepository implements SiteSettingsRepository {
    async findFirst() {
        const settings = await prisma.siteSettings.findFirst()
        return settings
    }

    async create(data: any) {
        const settings = await prisma.siteSettings.create({
            data,
        })
        return settings
    }

    async update(id: string, data: any) {
        console.log("Atualizando configurações:", { id, data })
        const settings = await prisma.siteSettings.update({
            where: { id },
            data,
        })
        return settings
    }

    async upsert(data: any) {
        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: data,
            create: { id: "default", ...data },
        })
        return settings
    }
} 
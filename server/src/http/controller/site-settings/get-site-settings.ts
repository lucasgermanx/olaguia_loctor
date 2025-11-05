import type { FastifyReply, FastifyRequest } from "fastify"
import { GetSiteSettingsUseCase } from "@/use-cases/site-settings/get-site-settings"
import { PrismaSiteSettingsRepository } from "@/repositories/prisma/prisma-site-settings-repository"

export async function getSiteSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
        const siteSettingsRepository = new PrismaSiteSettingsRepository()
        const getSiteSettingsUseCase = new GetSiteSettingsUseCase(siteSettingsRepository)

        const { settings } = await getSiteSettingsUseCase.execute()

        return reply.status(200).send({ settings })
    } catch (error) {
        console.error("Erro ao buscar configurações do site:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
} 
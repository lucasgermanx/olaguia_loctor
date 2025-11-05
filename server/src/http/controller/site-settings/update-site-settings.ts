import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UpdateSiteSettingsUseCase } from "@/use-cases/site-settings/update-site-settings"
import { PrismaSiteSettingsRepository } from "@/repositories/prisma/prisma-site-settings-repository"

const updateSiteSettingsBodySchema = z.record(z.string().optional())

export async function updateSiteSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
        console.log("Dados recebidos:", request.body)
        const data = updateSiteSettingsBodySchema.parse(request.body)

        const siteSettingsRepository = new PrismaSiteSettingsRepository()
        const updateSiteSettingsUseCase = new UpdateSiteSettingsUseCase(siteSettingsRepository)

        const { settings } = await updateSiteSettingsUseCase.execute(data)

        return reply.status(200).send({
            settings,
            message: "Configurações atualizadas com sucesso",
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log("Erro de validação:", error.errors)
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: error.errors,
            })
        }

        console.error("Erro ao atualizar configurações do site:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
} 
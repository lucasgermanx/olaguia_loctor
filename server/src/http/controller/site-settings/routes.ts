import type { FastifyInstance } from "fastify"
import { getSiteSettings } from "./get-site-settings"
import { updateSiteSettings } from "./update-site-settings"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"

export async function siteSettingsRoutes(app: FastifyInstance) {
    // Rota pública para buscar configurações
    app.get("/site-settings", getSiteSettings)

    // Rota protegida para atualizar configurações (apenas admin)
    app.put("/site-settings", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updateSiteSettings)
} 
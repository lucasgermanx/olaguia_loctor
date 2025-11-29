import type { FastifyInstance } from "fastify"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { createProfessional } from "./create"
import { listProfessionals } from "./list"
import { getProfessionalById } from "./get-by-id"
import { getProfessionalBySlug } from "./get-by-slug"
import { updateProfessional } from "./update"
import { deleteProfessional } from "./delete"

export async function professionalsRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/professionals", listProfessionals)
  app.get("/professionals/slug/:slug", getProfessionalBySlug)
  app.get("/professionals/id/:id", getProfessionalById)

  // Admin routes - require admin role
  app.post("/professionals", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, createProfessional)
  app.put("/professionals/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updateProfessional)
  app.delete("/professionals/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, deleteProfessional)
}


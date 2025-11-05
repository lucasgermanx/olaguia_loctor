import type { FastifyInstance } from "fastify"
import { uploadFile } from "./upload-file"
import { serveFile } from "./serve-file"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", { onRequest: [VerifyJWT] }, uploadFile)
  app.get("/files/:filename", serveFile)
} 
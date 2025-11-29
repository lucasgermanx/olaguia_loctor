import type { FastifyInstance } from "fastify"
import { uploadFile } from "./upload-file"
import { serveFile } from "./serve-file"
import { listUploads } from "./list-uploads"
import { deleteUpload } from "./delete-upload"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", { onRequest: [VerifyJWT] }, uploadFile)
  app.get("/uploads", { onRequest: [VerifyJWT] }, listUploads)
  app.delete("/uploads/:id", { onRequest: [VerifyJWT] }, deleteUpload)
  app.get("/files/:filename", serveFile)
} 
import type { FastifyInstance } from "fastify"
import { register } from "./register"
import { authenticate } from "./authenticate"
import { Profile } from "./get-profile"
import { updateProfile } from "./profile"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"
import { refresh } from "./refresh"
import { logout } from "./logout"
import { listUsers } from "./list-users"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { getUser } from "./get-user"
import { updateUser } from "./update-user"
import { createUser } from "./create-user"

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)

  app.patch("/token/refresh", refresh)
  app.post("/logout", { onRequest: [VerifyJWT] }, logout)

  app.get("/me", { onRequest: [VerifyJWT] }, Profile)
  app.put("/profile", { onRequest: [VerifyJWT] }, updateProfile)

  // Admin routes
  app.post("/admin/users", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, createUser)
  app.get("/admin/users", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, listUsers)
  app.get("/admin/user/:userId", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, getUser)
  app.put("/admin/user/:userId", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updateUser)
}

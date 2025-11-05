import type { FastifyInstance } from "fastify"
import { VerifyJWT } from "@/http/middlewares/verify-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { createPost } from "./posts/create"
import { listPosts } from "./posts/list"
import { getPostByID } from "./posts/get-by-id"
import { getPostBySlug } from "./posts/get-by-slug"
import { updatePost } from "./posts/update"
import { deletePost } from "./posts/delete"
import { createCategory } from "./categories/create"
import { listCategories } from "./categories/list"
import { getCategoryById } from "./categories/get-by-id"
import { updateCategory } from "./categories/update"
import { deleteCategory } from "./categories/delete"
import { createComment } from "./comments/create"
import { listComments } from "./comments/list"
import { createTag } from "./tags/create"
import { listTags } from "./tags/list"
import { getTagById } from "./tags/get-by-id"
import { updateTag } from "./tags/update"
import { deleteTag } from "./tags/delete"
import { getStats } from "./stats/get-stats"

export async function blogRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/posts", listPosts)
  app.get("/posts/slug/:slug", getPostBySlug)
  app.get("/posts/id/:id", getPostByID)
  app.get("/categories", listCategories)
  app.get("/categories/:id", getCategoryById)
  app.get("/tags", listTags)
  app.get("/tags/:id", getTagById)
  app.get("/posts/:postId/comments", listComments)

  // Protected routes - require authentication
  app.post("/comments", { onRequest: [VerifyJWT] }, createComment)

  // Admin routes - require admin role
  app.get("/admin/stats", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, getStats)

  // Posts
  app.post("/posts", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, createPost)
  app.put("/posts/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updatePost)
  app.delete("/posts/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, deletePost)

  // Categories
  app.post("/categories", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, createCategory)
  app.put("/categories/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updateCategory)
  app.delete("/categories/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, deleteCategory)

  // Tags
  app.post("/tags", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, createTag)
  app.put("/tags/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, updateTag)
  app.delete("/tags/:id", { onRequest: [VerifyJWT, verifyUserRole("ADMIN")] }, deleteTag)
}

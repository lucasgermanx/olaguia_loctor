import fastify from "fastify"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import fastifyMultipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
import { ZodError } from "zod"
import { env } from "./env"
import { usersRoutes } from "./http/controller/users/routes"
import { blogRoutes } from "./http/controller/blog/routes"
import { uploadRoutes } from "./http/controller/upload/routes"
import { siteSettingsRoutes } from "./http/controller/site-settings/routes"
import { professionalsRoutes } from "./http/controller/professionals/routes"
import { join } from "path"

export const app = fastify()

app.register(require("@fastify/cors"), {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
})

app.register(fastifyCookie)
app.register(fastifyMultipart, {
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
})

// Servir arquivos estáticos
app.register(fastifyStatic, {
  root: join(__dirname, "..", "public"),
  prefix: "/",
  decorateReply: false,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
})

app.register(usersRoutes)
app.register(blogRoutes)
app.register(uploadRoutes)
app.register(siteSettingsRoutes)
app.register(professionalsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation Error", issues: error.format() })
  }
  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Send to an error tracking service
  }

  return reply.status(500).send({ message: "Internal server error." })
})

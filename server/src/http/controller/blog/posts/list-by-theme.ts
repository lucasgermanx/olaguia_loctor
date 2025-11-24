import type { FastifyRequest, FastifyReply } from "fastify"
import { makeListPostsByThemeUseCase } from "@/use-cases/factories/make-list-posts-by-theme-use-case"

export async function listPostsByTheme(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listPostsByThemeUseCase = makeListPostsByThemeUseCase()

    const { postsByTheme, ads } = await listPostsByThemeUseCase.execute()

    return reply.status(200).send({
      postsByTheme,
      ads,
    })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: "Error listing posts by theme" })
  }
}


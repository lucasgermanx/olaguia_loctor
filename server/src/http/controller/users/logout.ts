import type { FastifyReply, FastifyRequest } from "fastify"

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {
        reply.clearCookie("token", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        return reply.status(200).send({
            message: "Logout realizado com sucesso",
        })
    } catch (error) {
        console.error("Erro no logout:", error)
        return reply.status(500).send({
            message: "Erro interno do servidor",
        })
    }
} 
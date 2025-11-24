import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        console.log(email, password)
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user } = await authenticateUseCase.execute({ email, password });

        const token = await reply.jwtSign(
            { role: user.role },
            { sign: { sub: user.id, expiresIn: "12h" } }
        );

        const refreshToken = await reply.jwtSign(
            { role: user.role },
            { sign: { sub: user.id, expiresIn: "7d" } }
        );

        console.log({ token, refreshToken })

        return reply
            .setCookie("token", token, {
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                httpOnly: true,
                maxAge: 60 * 60, // 1h
            })
            .setCookie("refreshToken", refreshToken, {
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 7d
            })
            .status(200)
            .send({ token }); // ou `send(null)` se quiser esconder info
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message });
        }
        throw err;
    }
}

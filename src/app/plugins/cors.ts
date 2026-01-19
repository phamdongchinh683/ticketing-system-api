import { FastifyInstance } from "fastify"
import fastifyPlugin from "fastify-plugin"
import fastifyCors from "@fastify/cors"

export const corsPlugin = fastifyPlugin(async (app: FastifyInstance) => {
    await app.register(fastifyCors, {
        methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        origin: process.env.CORS_ORIGIN ?? "*",
    })
})
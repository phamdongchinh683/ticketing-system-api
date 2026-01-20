import rateLimit from '@fastify/rate-limit'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { HttpErr } from '../index.js'

export const rateLimitPlugin = fastifyPlugin(async (app: FastifyInstance) => {
    await app.register(rateLimit, {
        // global: true,
        // max: 0,
        // timeWindow: "10s",
        keyGenerator: req => req.ip,
        errorResponseBuilder: (request, context) => {
            throw new HttpErr.TooManyRequests(`Rate limit exceeded. Try again in ${context.after}`)
        },
    })
})

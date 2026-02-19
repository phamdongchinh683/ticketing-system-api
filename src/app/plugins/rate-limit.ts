import rateLimit from '@fastify/rate-limit'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { HttpErr } from '../index.js'

export const rateLimitPlugin = fastifyPlugin(async (app: FastifyInstance) => {
    await app.register(rateLimit, {
        global: false, // Only apply to routes with explicit config.rateLimit
        max: 10000, // Very high default (only used if route doesn't specify)
        timeWindow: '1m',
        keyGenerator: req => req.ip,
        errorResponseBuilder: (request, context) => {
            throw new HttpErr.TooManyRequests(`Rate limit exceeded. Try again in ${context.after}`)
        },
    })
})

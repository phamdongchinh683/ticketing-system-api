import Fastify, { type FastifyInstance, type HTTPMethods } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { readdirSync, statSync } from 'fs'
import path, { dirname, parse, relative, sep } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { errorHandlerPlugin } from './error-handler.js'
import dotenv from 'dotenv'
import QueryString from 'qs'
import _ from 'lodash'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = path.join(__dirname, '..')
const apiDir = path.join(rootDir, 'api')
const isProduction = process.env.NODE_ENV === 'production'

const api = Fastify({
    routerOptions: {
        querystringParser: (query: string) => {
            const parsed = QueryString.parse(query)
            return parsed
        },
    },
    logger: !isProduction,
}).withTypeProvider<ZodTypeProvider>()

api.setValidatorCompiler(validatorCompiler)
api.setSerializerCompiler(serializerCompiler)

api.addHook('preHandler', async (request, reply) => {
    const keys = ['body', 'headers', 'method', 'params', 'query', 'url']
    const preHandler = _.pick(request, keys)
    if (!request.url.includes('swagger') && !request.url.startsWith('/docs'))
        request.log.info({ preHandler })
})

api.addHook('preSerialization', async (request, reply, response) => {
    if (!request.url.includes('swagger') && !request.url.startsWith('/docs'))
        request.log.info({
            preSerialization: {
                response,
                statusCode: reply.statusCode,
                ..._.pick(request, ['method', 'url']),
            },
        })
    return response
})

export const bearer = [{ bearerAuth: [] }]

export const endpoint = (filename: string): { method: string; url: string } => {
    const method = parse(filename).name
    const normalizedPath = filename.replace(/\.(ts|js)$/, '')
    let url = dirname(relative(apiDir, normalizedPath))

    url = url.replace(/^\/+/, '') || '/'
    url = url === '/' ? '' : url

    url = url.replace(/\[([^\]]+)\]/g, ':$1')

    if (url && !url.startsWith('/')) {
        url = '/' + url
    }

    return { method, url: url || '/' }
}

export const tags = (filename: string): string[] => [
    relative(__dirname, filename).replace('../api/', '').split(sep)[0],
]

async function registerApiRoutes(app: FastifyInstance) {
    const files: string[] = []
    const allowedExtensions = ['.ts', '.js']

    const walk = (dir: string) => {
        try {
            const entries = readdirSync(dir)
            for (const entry of entries) {
                const fullPath = path.join(dir, entry)
                try {
                    const stat = statSync(fullPath)
                    if (stat.isDirectory()) {
                        walk(fullPath)
                    } else if (
                        stat.isFile() &&
                        allowedExtensions.includes(path.extname(fullPath))
                    ) {
                        files.push(fullPath)
                    }
                } catch (err) {
                    app.log.warn({ err, path: fullPath }, 'Failed to stat file/directory')
                }
            }
        } catch (err) {
            app.log.error({ err, dir }, 'Failed to read directory')
            throw err
        }
    }

    walk(apiDir)

    for (const file of files) {
        try {
            const { method, url } = endpoint(file)
            const mod = await import(pathToFileURL(file).href)
            const handler = mod.handler ?? mod.default

            if (typeof handler !== 'function') {
                app.log.debug({ file }, 'Skipping file without handler function')
                continue
            }

            const routeSchema = mod.schema

            app.route({
                method: method.toUpperCase() as HTTPMethods,
                url,
                schema: {
                    ...(routeSchema ?? {}),
                    tags: routeSchema?.tags ?? tags(file),
                },
                handler,
            })
            app.log.debug({ method, url, file }, 'Registered route')
        } catch (err) {
            app.log.error({ err, file }, 'Failed to register route')
        }
    }
}

const start = async () => {
    try {
        await api.register(errorHandlerPlugin)

        await api.register(swagger, {
            openapi: {
                info: {
                    title: 'API',
                    description: 'API documentation for the QR-based table ordering system',
                    version: '1.0.0',
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                },
            },
            transform: jsonSchemaTransform,
        })

        await api.register(swaggerUI, {
            routePrefix: '/swagger/docs',
            uiConfig: {
                docExpansion: 'list',
                deepLinking: false,
            },
        })

        await registerApiRoutes(api)

        const host = process.env.HOST
        const port = process.env.PORT

        if (!host) throw new Error('env HOST not found')
        if (!port) throw new Error('env PORT not found')

        api.listen({ host, port: +port }, () => {
            console.log({ Document: `http://${host}:${port}/swagger/docs` })
        })
    } catch (err) {
        api.log.error(err)
        process.exit(1)
    }
}

start().catch(err => {
    console.error('Failed to start server:', err)
    process.exit(1)
})

export { api }

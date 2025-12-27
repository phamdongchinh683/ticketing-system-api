import { z } from 'zod'
import { api, bearer, endpoint, tags } from '../../app/api.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        return {
            message: 'OK',
        }
    },
    schema: {
        querystring: z.object({
            id: z.string(),
        }),
        response: { 200: z.object({ message: z.string() }) },
        security: bearer,
        tags: tags(__filename),
    },
})

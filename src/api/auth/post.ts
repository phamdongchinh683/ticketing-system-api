import { z } from 'zod'
import { AuthBody } from '../../model/body/auth/index.js'
import { api, bearer, endpoint, tags } from '../../app/api.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        console.log(request.body)
        return {
            message: 'OK',
        }
    },

    schema: {
        body: AuthBody,
        response: { 200: z.object({ message: z.string() }) },
        security: bearer,
        tags: tags(__filename),
    },
})

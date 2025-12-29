import { z } from 'zod'
import { AuthBody, AuthResponse } from '../../../model/body/auth/index.js'
import { api, bearer, endpoint, tags } from '../../../app/api.js'
import { bus } from '../../../business/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        return await bus.auth.register(request.body)
    },

    schema: {
        body: AuthBody,
        response: { 200: AuthResponse },
        security: bearer,
        tags: tags(__filename),
    },
})

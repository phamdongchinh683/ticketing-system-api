import { z } from 'zod'
import { AuthBody } from '../../../model/body/auth/index.js'
import { api, endpoint, tags } from '../../../app/api.js'
import { bus } from '../../../business/index.js'
import { AuthSignInResponse } from '../../../model/body/auth/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        return await bus.auth.signIn(request.body)
    },

    schema: {
        body: AuthBody,
        response: { 200: AuthSignInResponse },
        tags: tags(__filename),
    },
})

import { api, endpoint, tags, bearer } from '../../../app/api.js'
import { requiredAuthenticate } from '../../../app/jwt/handler.js'
import { bus } from '../../../business/index.js'
import { UserUpdatePasswordBody } from '../../../model/body/user/index.js'
import { MessageResponse } from '../../../model/common.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    config: {
        rateLimit: {
            max: 10,
            timeWindow: '1m',
        },
    },

    handler: async request => {
        const userInfo = requiredAuthenticate(request.headers)

        return await bus.auth.password.updatePassword(userInfo.id, request.body)
    },

    schema: {
        body: UserUpdatePasswordBody,
        response: { 200: MessageResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

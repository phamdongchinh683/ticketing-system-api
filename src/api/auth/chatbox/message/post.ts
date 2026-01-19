import { AuthBody, AuthResponse } from '../../../../model/body/auth/index.js'
import { api, endpoint, tags } from '../../../../app/api.js'
import { bus } from '../../../../business/index.js'
import z from 'zod'
import { ChatboxBody, ChatboxResponse } from '../../../../model/body/chatbox/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        const { userId, message } = request.body
        return  bus.chatbox.answerMessage({ userId, message })
    },

    schema: {
        body: ChatboxBody,
        response: { 200: ChatboxResponse },
        tags: tags(__filename),
    },
})

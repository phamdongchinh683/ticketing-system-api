import { api, endpoint, tags } from '../../../../app/api.js'
import { bus } from '../../../../business/index.js'
import { VnPayIpnResponse } from '../../../../model/body/payment/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        return await bus.payment.payment.vnpayIpn(request.query as Record<string, string>)
    },
    schema: {
        response: {
            200: VnPayIpnResponse,
        },
        tags: tags(__filename),
    },
})

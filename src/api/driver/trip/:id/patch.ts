import { api, endpoint, tags, bearer } from '../../../../app/api.js'
import { bus } from '../../../../business/index.js'
import { AuthUserRole } from '../../../../database/auth/user/type.js'
import { requireRoles } from '../../../../app/jwt/handler.js'
import { TripUpdateBody, TripUpdateResponse } from '../../../../model/body/trip/index.js'
import { TripIdParam } from '../../../../model/params/trip/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        const userInfo = requireRoles(request.headers, [AuthUserRole.enum.driver])
        return await bus.operation.trip.updateTripStatus({
            id: request.params.id,
            status: request.body.status,
            userId: userInfo.id,
        })
    },

    schema: {
        params: TripIdParam,
        body: TripUpdateBody,
        response: { 200: TripUpdateResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

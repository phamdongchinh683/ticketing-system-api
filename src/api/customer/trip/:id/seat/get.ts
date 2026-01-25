import { TripSeatParam } from '../../../../../model/params/trip/index.js'
import { api, endpoint, bearer, tags } from '../../../../../app/api.js'
import { requireRoles } from '../../../../../app/jwt/handler.js'
import { bus } from '../../../../../business/index.js'
import { AuthUserRole } from '../../../../../database/auth/user/type.js'
import { TripSeatResponse } from '../../../../../model/body/trip/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        requireRoles(request.headers, [AuthUserRole.enum.customer])
        return await bus.organization.seat.getSeats(request.params)
    },

    schema: {
        params: TripSeatParam,
        response: { 200: TripSeatResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

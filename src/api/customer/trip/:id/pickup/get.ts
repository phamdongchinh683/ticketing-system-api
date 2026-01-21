import { api, endpoint, bearer, tags } from '../../../../../app/api.js'
import { requireRoles } from '../../../../../app/jwt/handler.js'
import { bus } from '../../../../../business/index.js'
import { AuthUserRole } from '../../../../../database/auth/user/type.js'
import { TripStopResponse } from '../../../../../model/body/trip/index.js'
import { TripIdPickupParam } from '../../../../../model/query/trip/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        requireRoles(request.headers, [AuthUserRole.enum.customer])
        const { id } = request.params
        return await bus.auth.customer.getLocationTripStops(id, 'pickup')
    },

    schema: {
        params: TripIdPickupParam,
        response: { 200: TripStopResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

import { api, endpoint, bearer, tags } from '../../../../../app/api.js'
import { requireRoles } from '../../../../../app/jwt/handler.js'
import { bus } from '../../../../../business/index.js'
import { AuthUserRole } from '../../../../../database/auth/user/type.js'
import { TripStopResponse } from '../../../../../model/body/trip/index.js'
import { TripIdDropoffQuery, TripIdPickupParam } from '../../../../../model/query/trip/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    handler: async request => {
        // requireRoles(request.headers, [AuthUserRole.enum.customer])
        const { pickupOrder } = request.query as TripIdDropoffQuery
        return await bus.auth.customer.getLocationTripStops(request.params.id, 'dropoff', pickupOrder)
    },

    schema: {
        params: TripIdPickupParam,
        querystring: TripIdDropoffQuery,
        response: { 200: TripStopResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

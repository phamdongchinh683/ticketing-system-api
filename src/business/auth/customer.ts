import { AuthUserRole, AuthUserStatus } from '../../database/auth/user/type.js'
import { dal } from '../../database/index.js'
import { OperationTripId } from '../../database/operation/trip/type.js'
import { AuthBody } from '../../model/body/auth/index.js'
import { ContactInfo, Direction } from '../../model/common.js'
import { TripFilter } from '../../model/query/trip/index.js'
import { utils } from '../../utils/index.js'

// customer auth
export async function register(body: AuthBody, role: AuthUserRole) {
    const data = {
        username: body.username,
        fullName: body.fullName,
        ...parseContactInfo(body.contactInfo),
        password: utils.password.hashPassword(body.password),
        role,
        status: AuthUserStatus.enum.active,
    }

    return dal.auth.user.cmd.signUp(data)
}

function parseContactInfo(contactInfo: ContactInfo) {
    return {
        email: contactInfo.email,
        phone: contactInfo.phone,
    }
}

// trip

export async function getTrips(query: TripFilter) {
    const limit = query.limit ?? 10
    const trips = await dal.operation.trip.cmd.getManyByFilter(query)

    const hasNextPage = trips.length > limit
    const data = hasNextPage ? trips.slice(0, limit + 1) : trips

    const last = data[data.length - 1]
    const next = last ? last.id : null

    return {
        trips: data,
        next,
        hasNextPage,
    }
}

export async function getLocationTripStops(id: OperationTripId, direction: Direction, stopOrder?: number) {
    return {
        tripStops: await dal.operation.tripStop.cmd.getLocationTripStops(id, direction, stopOrder),
    }
}

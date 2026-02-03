import { AuthUserId } from '../../database/auth/user/type.js'
import { OperationTripId, OperationTripStatus } from '../../database/operation/trip/type.js'
import { dal } from '../../database/index.js'
import { TripBody } from '../../model/body/trip/index.js'
import { DriverTripQuery, TripFilter } from '../../model/query/trip/index.js'
import { PassengerTicketFilter } from '../../model/query/ticket/index.js'

export async function getTrips(query: TripFilter) {
    const limit = query.limit ?? 10
    const trips = await dal.operation.trip.cmd.getManyByFilter(query)

    const hasNextPage = trips.length > limit
    const data = hasNextPage ? trips.slice(0, limit) : trips

    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        trips: data,
        next,
    }
}

export async function prepareTrip(body: TripBody) {
    return await dal.operation.trip.cmd.createTripTransaction(body)
}

export async function getPassengerList(params: { tripId: OperationTripId; driverId: AuthUserId }, q: PassengerTicketFilter) {
    const { tripId, driverId } = params
    const passengers = await dal.booking.ticket.query.findPassengersByDriverAndTripId({ tripId, driverId }, q)
    const hasNextPage = passengers.length > q.limit
    const data = hasNextPage ? passengers.slice(0, q.limit) : passengers
    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        passengers: data,
        next,
    }
}

export async function getDriverTrips(query: DriverTripQuery, userId: AuthUserId) {
    const limit = query.limit ?? 10
    const trips = await dal.operation.trip.cmd.getManyByDriverId(query, userId)

    const hasNextPage = trips.length > limit
    const data = hasNextPage ? trips.slice(0, limit) : trips

    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        trips: data,
        next,
    }
}


export async function updateTripStatus(params: { id: OperationTripId; status: OperationTripStatus; userId: AuthUserId }) {
    return await dal.operation.trip.cmd.updateStatus(params)
}
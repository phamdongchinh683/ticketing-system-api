import { dal } from '../../database/index.js'
import { OperationTripId } from '../../database/operation/trip/type.js'
import { Direction } from '../../model/common.js'
import { TripSeatParam } from '../../model/params/trip/index.js'

export async function getLocationTripStops(
    id: OperationTripId,
    direction: Direction,
    stopOrder?: number
) {
    return {
        tripStops: await dal.operation.tripStop.cmd.getLocationTripStops(id, direction, stopOrder),
    }
}

export async function getSeats(params: TripSeatParam) {
    return {
        seats: await dal.organization.seat.cmd.getSeats(params),
    }
}

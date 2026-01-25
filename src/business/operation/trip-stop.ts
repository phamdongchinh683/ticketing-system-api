import { dal } from '../../database/index.js'
import { OperationTripId } from '../../database/operation/trip/type.js'
import { Direction } from '../../model/common.js'

export async function getLocationTripStops(
    id: OperationTripId,
    direction: Direction,
    stopOrder?: number
) {
    return {
        tripStops: await dal.operation.tripStop.cmd.getLocationTripStops(id, direction, stopOrder),
    }
}

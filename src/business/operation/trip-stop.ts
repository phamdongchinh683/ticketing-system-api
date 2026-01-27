import { dal } from '../../database/index.js'
import { OperationStationId } from '../../database/operation/station/type.js'
import { OperationTripId } from '../../database/operation/trip/type.js'

export async function getPickupStops(id: OperationTripId) {
    return {
        tripStops: await dal.operation.tripStop.cmd.findAllPickupStop(id),
    }
}

export async function getDropoffStops(
    tripId: OperationTripId,
    fromStationId: OperationStationId,
    stopOrder: number
) {
    return {
        tripStops: await dal.operation.tripStop.cmd.findAllDropoffStop(
            tripId,
            fromStationId,
            stopOrder
        ),
    }
}

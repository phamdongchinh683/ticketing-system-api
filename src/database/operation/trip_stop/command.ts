import { dal } from '../../index.js'
import { OperationStationId } from '../station/type.js'
import { OperationTripId } from '../trip/type.js'

export async function findAllPickupStop(
    id: OperationTripId,
) {
    return await dal.operation.tripStop.query.getPickupStopsByTripId(id)
}

export async function findAllDropoffStop(
    tripId: OperationTripId,
    fromStationId: OperationStationId,
    stopOrder: number
) {
    return await dal.operation.tripStop.query.getDropoffStopsWithPrice(tripId, fromStationId, stopOrder)
}
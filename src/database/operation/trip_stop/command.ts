import { dal } from '../../index.js'
import { OperationTripId } from '../trip/type.js'
import { Direction } from '../../../model/common.js'

export async function getLocationTripStops(id: OperationTripId, direction: Direction, stopOrder?: number) {
    return await dal.operation.tripStop.query.getLocationTripStopByTripId(id, direction, stopOrder)
}

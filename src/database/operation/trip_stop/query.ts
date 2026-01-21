import { db } from '../../../datasource/db.js'
import { OperationTripId } from '../trip/type.js'
import { Direction } from '../../../model/common.js'

export async function getLocationTripStopByTripId(
    id: OperationTripId,
    direction: Direction,
    stopOrder?: number
) {
    return db
        .selectFrom('operation.trip_stop as ts')
        .innerJoin('operation.station as s', 'ts.stationId', 's.id')
        .where(eb => {
            const cond = []
            cond.push(eb('ts.tripId', '=', id))
            if (direction === 'pickup') {
                cond.push(eb('ts.allowPickup', '=', true))
            } else {
                cond.push(eb('ts.allowDropoff', '=', true))
            }
            if (stopOrder) {
                cond.push(eb('ts.stopOrder', '>', stopOrder))
            }
            return eb.and(cond)
        })
        .select(['s.address', 's.city', 'ts.stopOrder', 'ts.arrivalTime', 'ts.departureTime'])
        .orderBy('ts.stopOrder')
        .execute()
}

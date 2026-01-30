import { db } from '../../../datasource/db.js'
import { TripSeatParam } from '../../../model/params/trip/index.js'
import { OperationTripId } from '../../operation/trip/type.js'
import { OrganizationVehicleId } from '../vehicle/type.js'

export function getSeatsByVehicle(vehicleId: OrganizationVehicleId) {
    return db
        .selectFrom('organization.seat as s')
        .where('s.vehicleId', '=', vehicleId)
        .select(['s.id', 's.seatNumber'])
}

function getOccupiedSeatsSubQuery(params: TripSeatParam) {
    const { id, pickup, dropoff } = params
    return db
        .selectFrom('booking.seat_segment as ss')
        .innerJoin('operation.trip_stop as ts', join =>
            join.onRef('ts.tripId', '=', 'ss.tripId').onRef('ts.stationId', '=', 'ss.fromStationId')
        )
        .innerJoin('operation.trip_stop as fs', join =>
            join.onRef('fs.stationId', '=', 'ss.toStationId').onRef('fs.tripId', '=', 'ss.tripId')
        )
        .where(eb => {
            const cond = []
            cond.push(eb('ss.tripId', '=', id))
            cond.push(eb('ts.stopOrder', '<', dropoff))
            cond.push(eb('fs.stopOrder', '>', pickup))
            return eb.and(cond)
        })
        .select(['ss.seatId'])
}

function getVehicleIdByTrip(tripId: OperationTripId) {
    return db
        .selectFrom('operation.trip')
        .select('vehicleId')
        .where('id', '=', tripId)
        .executeTakeFirstOrThrow()
}

export async function getAvailableSeats(params: TripSeatParam ) {
    
    const { vehicleId } = await getVehicleIdByTrip(params.id)
    
    return db
        .selectFrom('organization.seat as s')
        .select(['s.id', 's.seatNumber'])
        .where(eb => {
            const cond = []
            cond.push(eb('s.vehicleId', '=', vehicleId))
            cond.push(eb('s.id', 'not in', getOccupiedSeatsSubQuery(params)))
            return eb.and(cond)
        })
        .orderBy('s.seatNumber')
        .execute()
}

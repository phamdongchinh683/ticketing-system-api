import { BookingSeatSegmentTableInsert } from './table.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'
import { BookingTicketRequest } from '../../../model/body/booking/index.js'
import { BookingTicketId, BookingTicketStatus } from '../ticket/type.js'
import { db } from '../../../datasource/db.js'

export async function createSeatSegmentTransaction(
    params: BookingSeatSegmentTableInsert,
    trx: Transaction<Database>
) {
    return trx
        .insertInto('booking.seat_segment')
        .values(params)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function insertManySeatSegmentsTransaction(
    params: BookingSeatSegmentTableInsert[],
    trx: Transaction<Database>
) {
    return trx.insertInto('booking.seat_segment').values(params).execute()
}

export async function lockSeatSegmentsTransaction(
    params: BookingTicketRequest,
    trx: Transaction<Database>
) {
    const { tripId, seatId, fromStationId, toStationId } = params
    const fromOrderSubQuery = trx
        .selectFrom('operation.trip_stop as rfs')
        .select('rfs.stopOrder')
        .where(eb =>
            eb.and([eb('rfs.tripId', '=', tripId), eb('rfs.stationId', '=', fromStationId)])
        )

    const toOrderSubQuery = trx
        .selectFrom('operation.trip_stop as rts')
        .select('rts.stopOrder')
        .where(eb => eb.and([eb('rts.tripId', '=', tripId), eb('rts.stationId', '=', toStationId)]))

    return trx
        .selectFrom('booking.seat_segment as ss')
        .innerJoin('operation.trip_stop as ts', join =>
            join.onRef('ts.tripId', '=', 'ss.tripId').onRef('ts.stationId', '=', 'ss.fromStationId')
        )
        .innerJoin('operation.trip_stop as fs', join =>
            join.onRef('fs.tripId', '=', 'ss.tripId').onRef('fs.stationId', '=', 'ss.toStationId')
        )
        .select('ss.id')
        .where(eb => {
            return eb.and([
                eb('ss.tripId', '=', tripId),
                eb('ss.seatId', '=', seatId),
                eb('ts.stopOrder', '<', toOrderSubQuery),
                eb('fs.stopOrder', '>', fromOrderSubQuery),
            ])
        })
        .forUpdate()
        .executeTakeFirst()
}

export async function deleteByTicketId(ticketId: BookingTicketId, trx?: Transaction<Database>) {
    return (trx ?? db).deleteFrom('booking.seat_segment').where('ticketId', '=', ticketId).execute()
}

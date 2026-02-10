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

export async function deleteByTicketId(ticketId: BookingTicketId, trx?: Transaction<Database>) {
    return (trx ?? db).deleteFrom('booking.seat_segment').where('ticketId', '=', ticketId).execute()
}

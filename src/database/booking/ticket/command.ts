import { Transaction } from 'kysely'
import { BookingTicketTableInsert, BookingTicketTableUpdate } from './table.js'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'
import { BookingTicketId, BookingTicketStatus } from './type.js'
import { BookingId } from '../booking/type.js'
import { db } from '../../../datasource/db.js'

export async function createTicketTransaction(
    params: BookingTicketTableInsert,
    trx: Transaction<Database>
) {
    const data = _.omitBy(params, v => _.isNil(v)) as BookingTicketTableInsert

    return trx.insertInto('booking.ticket').values(data).returningAll().executeTakeFirstOrThrow()
}

export async function insertManyTicketsTransaction(
    params: BookingTicketTableInsert[],
    trx: Transaction<Database>
) {
    return trx.insertInto('booking.ticket').values(params).returningAll().execute()
}

export async function updateTicketStatusByBookingId(
    params: {
        id: BookingId
        status: BookingTicketStatus
    },
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .updateTable('booking.ticket as t')
        .set({ status: params.status })
        .where('t.bookingId', '=', params.id)
        .returningAll()
        .execute()
}

import { Transaction } from 'kysely'
import { BookingTicketTableInsert, BookingTicketTableUpdate } from './table.js'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'
import { BookingTicketId, BookingTicketStatus } from './type.js'
import { BookingId, BookingStatus } from '../booking/type.js'
import { db } from '../../../datasource/db.js'
import { dal } from '../../index.js'
import { PaymentStatus } from '../../payment/payment/type.js'

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

export async function updateTicketStatus(
    params: { id: BookingTicketId; status: BookingTicketStatus },
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .updateTable('booking.ticket as t')
        .set({ status: params.status })
        .where('t.id', '=', params.id)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function cancelTicketTransaction(id: BookingTicketId) {
    return db.transaction().execute(async trx => {
        const ticket = await dal.booking.ticket.cmd.updateTicketStatus(
            { id, status: BookingTicketStatus.enum.cancelled },
            trx
        )

        const tickets = await dal.booking.ticket.cmd.updateTicketStatusByBookingId(
            {
                id: ticket.bookingId,
                status: BookingTicketStatus.enum.cancelled,
            },
            trx
        )

        for (const t of tickets) {
            await dal.booking.seatSegment.cmd.deleteByTicketId(t.id, trx)
        }

        await dal.booking.booking.cmd.updateBookingStatus(
            ticket.bookingId,
            BookingStatus.enum.cancelled,
            trx
        )

        const payment = await dal.payment.payment.query.getPayment(ticket.bookingId, undefined, trx)
        if (payment) {
            await dal.payment.payment.query.updateStatusPaymentTransaction(
                PaymentStatus.enum.failed,
                ticket.bookingId,
                trx
            )
        }

        return tickets
    })
}

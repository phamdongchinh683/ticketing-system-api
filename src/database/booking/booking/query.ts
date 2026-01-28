import { Transaction } from 'kysely'
import { db } from '../../../datasource/db.js'
import { Database } from '../../../datasource/type.js'
import { AuthUserId } from '../../auth/staff_detail/type.js'
import { BookingId } from './type.js'
import { BookingTicketId } from '../ticket/type.js'

export async function getAmountByBookingId(bookingId: BookingId) {
    return db
        .selectFrom('booking.booking as b')
        .select('b.totalAmount')
        .where('b.id', '=', bookingId)
        .executeTakeFirstOrThrow()
}

export async function getBookingByUserIdAndBookingId(
    params: {
        userId: AuthUserId
        bookingId?: BookingId
        ticketId?: BookingTicketId
    },
    trx?: Transaction<Database>
) {
    const { userId, bookingId, ticketId } = params
    return (trx ?? db)
        .selectFrom('booking.booking as b')
        .innerJoin('booking.ticket as t', 't.bookingId', 'b.id')
        .selectAll()
        .where(eb => {
            const cond = []
            cond.push(eb('b.userId', '=', userId))
            if (bookingId) cond.push(eb('b.id', '=', bookingId))
            if (ticketId) cond.push(eb('t.id', '=', ticketId))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

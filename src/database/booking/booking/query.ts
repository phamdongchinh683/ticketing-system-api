import { db } from '../../../datasource/db.js'
import { BookingId } from './type.js'

export async function getAmountByBookingId(bookingId: BookingId) {
    return db
        .selectFrom('booking.booking as b')
        .select('b.totalAmount')
        .where('b.id', '=', bookingId)
        .executeTakeFirstOrThrow()
}

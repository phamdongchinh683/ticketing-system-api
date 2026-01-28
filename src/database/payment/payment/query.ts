import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { BookingId } from '../../booking/booking/type.js'
import { PaymentStatus } from './type.js'
import { db } from '../../../datasource/db.js'

export async function updatePaymentTransactionByCode(
    transactionCode: string,
    params: {
        status: PaymentStatus
        paidAt?: Date
        transactionNo?: string
    },
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .updateTable('payment.payment as pp')
        .set(params)
        .where('pp.transactionCode', '=', transactionCode)
        .returningAll()
        .execute()
}

export async function updateStatusPaymentTransaction(
    status: PaymentStatus,
    bookingId: BookingId,
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .updateTable('payment.payment as pp')
        .set({ status })
        .where('pp.bookingId', '=', bookingId)
        .executeTakeFirstOrThrow()
}

export async function getPayment(
    bookingId?: BookingId,
    transactionCode?: string,
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .selectFrom('payment.payment as pp')
        .innerJoin('booking.booking as b', 'b.id', 'pp.bookingId')
        .select([
            'pp.id',
            'pp.bookingId',
            'pp.amount',
            'pp.method',
            'pp.status',
            'pp.transactionCode',
            'pp.paidAt',
            'b.expiredAt',
        ])
        .where(eb => {
            const cond = []
            if (bookingId) cond.push(eb('pp.bookingId', '=', bookingId))
            if (transactionCode) cond.push(eb('pp.transactionCode', '=', transactionCode))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

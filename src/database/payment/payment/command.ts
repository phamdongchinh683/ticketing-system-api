import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { PaymentTableInsert } from './table.js'
import _ from 'lodash'
import { db } from '../../../datasource/db.js'
import { dal } from '../../index.js'
import { PaymentStatus } from './type.js'
import { utils } from '../../../utils/index.js'
import { BookingStatus } from '../../booking/booking/type.js'
import { BookingTicketStatus } from '../../booking/ticket/type.js'

export async function createPaymentTransaction(
    params: PaymentTableInsert,
    trx: Transaction<Database>
) {
    const data = _.omitBy(params, v => _.isNil(v)) as PaymentTableInsert

    return trx.insertInto('payment.payment').values(data).returningAll().executeTakeFirstOrThrow()
}

export async function upsertPayment(params: PaymentTableInsert) {
    const data = _.omitBy(params, v => _.isNil(v)) as PaymentTableInsert
    return db
        .insertInto('payment.payment')
        .values(data)
        .onConflict(oc => oc.column('bookingId').doUpdateSet(data))
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function updatePaymentStatusSuccess(
    transactionCode: string,
    transactionNo: string,
    trx: Transaction<Database>
) {
    const payment = await dal.payment.payment.query.updatePaymentTransactionByCode(
        transactionCode,
        {
            status: PaymentStatus.enum.success,
            paidAt: utils.time.getNow().toDate(),
            transactionNo,
        },
        trx
    )

    await dal.booking.booking.cmd.updateBookingStatus(
        payment[0].bookingId,
        BookingStatus.enum.paid,
        trx
    )

    await dal.booking.ticket.cmd.updateTicketStatusByBookingId(
        {
            id: payment[0].bookingId,
            status: BookingTicketStatus.enum.paid,
        },
        trx
    )
}

export async function updatePaymentStatusFailed(
    transactionCode: string,
    tx: Transaction<Database>
) {
    const payment = await dal.payment.payment.query.updatePaymentTransactionByCode(
        transactionCode,
        {
            status: PaymentStatus.enum.failed,
        },
        tx
    )

    await dal.booking.booking.cmd.updateBookingStatus(
        payment[0].bookingId,
        BookingStatus.enum.cancelled,
        tx
    )

    const ticket = await dal.booking.ticket.cmd.updateTicketStatusByBookingId(
        {
            id: payment[0].bookingId,
            status: BookingTicketStatus.enum.cancelled,
        },
        tx
    )
    for (const t of ticket) {
        await dal.booking.seatSegment.cmd.deleteByTicketId(t.id, tx)
    }
}

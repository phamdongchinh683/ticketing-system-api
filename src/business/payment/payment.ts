import { dal } from '../../database/index.js'
import { utils } from '../../utils/index.js'
import { PaymentMethodRequest } from '../../model/query/payment/index.js'
import { PaymentMethod, PaymentStatus } from '../../database/payment/payment/type.js'
import { service } from '../../service/index.js'
import { HttpErr } from '../../app/index.js'

export async function createPayment(params: PaymentMethodRequest, ip: string) {
    const { method } = params

    switch (method) {
        case PaymentMethod.enum.vnpay:
            return await createVnpayPayment(params, ip)
        case PaymentMethod.enum.zalopay:
            return {
                message: 'Zalopay is not supported yet',
            }
        case PaymentMethod.enum.momo:
            return {
                message: 'Momo is not supported yet',
            }
        case PaymentMethod.enum.cash:
            return await createCashPayment(params)
        default:
            throw new HttpErr.UnprocessableEntity(
                'Invalid payment method',
                'INVALID_PAYMENT_METHOD'
            )
    }
}

export async function createCashPayment(params: PaymentMethodRequest) {
    const { bookingId } = params

    const existingPayment = await dal.payment.payment.query.getPayment(bookingId)

    if (existingPayment) {
        if (existingPayment.status === PaymentStatus.enum.success) {
            throw new HttpErr.UnprocessableEntity('Booking already paid', 'BOOKING_ALREADY_PAID')
        }

        if (existingPayment.method !== PaymentMethod.enum.cash) {
            throw new HttpErr.UnprocessableEntity(
                'Another payment method already exists',
                'PAYMENT_METHOD_CONFLICT'
            )
        }

        return {
            message: 'Cash payment already exists',
        }
    }

    const amount = (await dal.booking.booking.query.getAmountByBookingId(bookingId)).totalAmount

    const payment = await dal.payment.payment.cmd.upsertPayment({
        bookingId,
        transactionCode: utils.random.generateRandomString(12),
        method: PaymentMethod.enum.cash,
        status: PaymentStatus.enum.pending,
        amount,
        paidAt: null,
    })

    return {
        message: 'OK',
        payment,
    }
}

export async function createVnpayPayment(params: PaymentMethodRequest, ip: string) {
    let payment = await dal.payment.payment.query.getPayment(params.bookingId)

    if (!payment) {
        const amount = (await dal.booking.booking.query.getAmountByBookingId(params.bookingId))
            .totalAmount

        payment = await dal.payment.payment.cmd.upsertPayment({
            ...params,
            transactionCode: utils.random.generateRandomString(12),
            status: PaymentStatus.enum.pending,
            method: PaymentMethod.enum.vnpay,
            amount,
            paidAt: null,
        })
    }

    if (payment.status === PaymentStatus.enum.success) {
        throw new HttpErr.UnprocessableEntity('Already paid', 'PAYMENT_ALREADY_PAID')
    }

    if (payment.method !== PaymentMethod.enum.vnpay) {
        throw new HttpErr.UnprocessableEntity(
            'Another payment method already exists',
            'PAYMENT_METHOD_CONFLICT'
        )
    }

    return {
        message: 'OK',
        paymentUrl: service.vnpay.initiatePayment(payment.amount, payment.transactionCode, ip),
    }
}

export async function vnpayIpn(query: Record<string, string>) {
    return await service.vnpay.verifyIpn(query)
}

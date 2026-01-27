import { applyCoupon, validateCoupon } from '../../../business/booking/coupon.js'
import { CouponCheckCodeQuery, CouponFilter } from '../../../model/query/coupon/index.js'
import { dal } from '../../index.js'
import { OperationTripId } from '../../operation/trip/type.js'
import { BookingCouponId } from './type.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { OperationStationId } from '../../operation/station/type.js'
import { HttpErr } from '../../../app/index.js'
import { utils } from '../../../utils/index.js'

export async function findAllCoupons(filter: CouponFilter) {
    return await dal.booking.coupon.query.findAll(filter)
}

export async function getCouponByCode(params: CouponCheckCodeQuery) {
    return await dal.booking.coupon.query.findOneByCode(params)
}

export async function getCouponByCodeTransaction(
    params: CouponCheckCodeQuery,
    trx: Transaction<Database>
) {
    return trx
        .selectFrom('booking.coupon as c')
        .selectAll()
        .where(eb => {
            const cond = []
            if (params.id) {
                cond.push(eb('c.id', '=', params.id))
            }
            if (params.code) {
                cond.push(eb('c.code', '=', params.code))
            }
            return eb.and(cond)
        })
        .executeTakeFirstOrThrow()
}

export async function resultAmountOneWay(
    params: {
        tripId: OperationTripId
        fromStationId: OperationStationId
        toStationId: OperationStationId
    },
    trx: Transaction<Database>,
    couponId?: BookingCouponId
) {
    const originalAmount = await dal.operation.tripPrice.cmd.getPriceByTrip(params, trx)
    if (!originalAmount) {
        throw new HttpErr.NotFound(
            'Trip price not found for the selected segment',
            {
                tripId: params.tripId,
                fromStationId: params.fromStationId,
                toStationId: params.toStationId,
            },
            'TRIP_PRICE_NOT_FOUND'
        )
    }

    if (couponId) {
        const coupon = await getCouponByCodeTransaction(
            {
                id: couponId,
                orderTotal: originalAmount.price,
            },
            trx
        )

        if (coupon) {
            validateCoupon(coupon, originalAmount.price)
            const { discountAmount, finalTotal } = applyCoupon(coupon, originalAmount.price)
            return {
                originalAmount: originalAmount.price,
                discountAmount,
                totalAmount: finalTotal,
            }
        }
    }

    return {
        originalAmount: originalAmount.price,
        discountAmount: 0,
        totalAmount: originalAmount.price,
    }
}

export async function resultAmountRoundTrip(
    total: number,
    trx: Transaction<Database>,
    couponId?: BookingCouponId
) {
    if (couponId) {
        const coupon = await getCouponByCodeTransaction(
            {
                id: couponId,
                orderTotal: total,
            },
            trx
        )

        if (coupon) {
            validateCoupon(coupon, total)
            const { discountAmount, finalTotal } = applyCoupon(coupon, total)
            return {
                originalAmount: total,
                discountAmount,
                totalAmount: finalTotal,
            }
        }
    }

    return {
        originalAmount: total,
        discountAmount: 0,
        totalAmount: total,
    }
}

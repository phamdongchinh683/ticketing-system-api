import { dal } from '../../database/index.js'
import { CouponCheckCodeQuery, CouponFilter } from '../../model/query/coupon/index.js'
import { utils } from '../../utils/index.js'
import { HttpErr } from '../../app/index.js'
import { CouponResponse } from '../../model/body/coupon/index.js'
import { BookingCouponId, BookingDiscountType } from '../../database/booking/coupon/type.js'
import { OperationTripId } from '../../database/operation/trip/type.js'

export async function getCouponByCode(params: CouponCheckCodeQuery) {
    const coupon = await dal.booking.coupon.cmd.getCouponByCode(params)

    validateCoupon(coupon, params.orderTotal)

    const { discountAmount, finalTotal } = applyCoupon(coupon, params.orderTotal)

    return {
        discountAmount: discountAmount,
        finalTotal: finalTotal,
    }
}

export async function getCoupons(filter: CouponFilter) {
    const rows = await dal.booking.coupon.cmd.findAllCoupons(filter)
    const hasNextPage = rows.length > 10
    const data = hasNextPage ? rows.slice(0, 10) : rows
    return {
        coupons: data,
        next: hasNextPage ? data[data.length - 1]?.id : null,
    }
}

export function validateCoupon(coupon: CouponResponse, orderTotal: number) {
    const now = utils.time.getNow().toDate()
    if (coupon.startDate && coupon.startDate > now) {
        throw new HttpErr.UnprocessableEntity('Coupon is not active yet', 'COUPON_NOT_ACTIVE_YET')
    }
    if (coupon.endDate && coupon.endDate < now) {
        throw new HttpErr.UnprocessableEntity('Coupon is expired', 'COUPON_EXPIRED')
    }
    if (!coupon.isActive) {
        throw new HttpErr.UnprocessableEntity('Coupon is not active', 'COUPON_NOT_ACTIVE')
    }
    if (coupon.usedQuantity >= coupon.totalQuantity) {
        throw new HttpErr.UnprocessableEntity('Coupon is out of stock', 'COUPON_OUT_OF_STOCK', {
            totalQuantity: coupon.totalQuantity,
        })
    }
    if (coupon.minOrderAmount > orderTotal) {
        throw new HttpErr.UnprocessableEntity(
            'Order total is not eligible for this coupon',
            'ORDER_NOT_ELIGIBLE',
            { minOrderValue: coupon.minOrderAmount }
        )
    }
    if (coupon.maxDiscountAmount && coupon.maxDiscountAmount < coupon.discountValue) {
        throw new HttpErr.UnprocessableEntity(
            'Discount value is greater than the maximum discount amount for this coupon',
            'MAX_DISCOUNT_EXCEEDED',
            { maxDiscountAmount: coupon.maxDiscountAmount }
        )
    }

    return coupon
}

export function applyCoupon(coupon: CouponResponse, orderTotal: number) {
    let discountAmount = 0

    if (coupon.discountType === BookingDiscountType.enum.percent) {
        discountAmount = orderTotal * (coupon.discountValue / 100)

        if (coupon.maxDiscountAmount !== null) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount)
        }
    }

    if (coupon.discountType === BookingDiscountType.enum.fixed) {
        discountAmount = Math.min(coupon.discountValue, orderTotal)
    }

    discountAmount = Math.round(discountAmount * 100) / 100

    const finalTotal = Math.max(0, Math.round((orderTotal - discountAmount) * 100) / 100)

    return {
        discountAmount: discountAmount,
        finalTotal: finalTotal,
    }
}

export async function resultAmountOneWay(tripId: OperationTripId, couponId?: BookingCouponId) {
    const originalAmount = await dal.operation.tripPrice.cmd.findOneByTripId(tripId)

    if (couponId) {
        const coupon = await dal.booking.coupon.cmd.getCouponByCode({
            id: couponId,
            orderTotal: originalAmount.price,
        })
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

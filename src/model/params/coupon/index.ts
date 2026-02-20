import { BookingCouponId } from '../../../database/booking/coupon/type.js'
import z from 'zod'
export const CouponIdParam = z.object({
    id: BookingCouponId,
})

export type CouponIdParam = z.infer<typeof CouponIdParam>

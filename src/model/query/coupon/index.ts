import z from 'zod'
import { BookingCouponId } from '../../../database/booking/coupon/type.js'
export const CouponCheckCodeQuery = z.object({
    code: z.string().optional(),
    id: BookingCouponId.optional(),
    orderTotal: z.coerce.number(),
})
export type CouponCheckCodeQuery = z.infer<typeof CouponCheckCodeQuery>

export const CouponFilter = z.object({
    next: BookingCouponId.optional(),
    orderTotal: z.coerce.number(),
})

export type CouponFilter = z.infer<typeof CouponFilter>

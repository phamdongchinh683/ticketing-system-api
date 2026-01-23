import { CouponCheckCodeQuery, CouponFilter } from '../../../model/query/coupon/index.js'
import { dal } from '../../index.js'

export async function findAllCoupons(filter: CouponFilter) {
    return await dal.booking.coupon.query.findAll(filter)
}

export async function getCouponByCode(params: CouponCheckCodeQuery) {
    return await dal.booking.coupon.query.findOneByCode(params)
}

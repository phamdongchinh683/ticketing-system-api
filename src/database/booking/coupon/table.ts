import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { BookingCouponId, BookingDiscountType } from './type.js'

export interface BookingCouponTable extends Timestamps {
    id: GeneratedAlways<BookingCouponId>
    code: string
    discountType: BookingDiscountType
    discountValue: number
    minOrderAmount: number
    maxDiscountAmount: number
    totalQuantity: number
    usedQuantity: number
    startDate: Date
    endDate: Date
    isActive: boolean
}

export type BookingCouponTableInsert = Insertable<BookingCouponTable>
export type BookingCouponTableSelect = Selectable<BookingCouponTable>
export type BookingCouponTableUpdate = Updateable<BookingCouponTable>

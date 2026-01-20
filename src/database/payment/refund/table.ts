import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { PaymentRefundId } from './type.js'
import { PaymentId } from '../payment/type.js'
import { AuthUserId } from '../../auth/user/type.js'
export interface PaymentRefundTable extends Timestamps {
    id: GeneratedAlways<PaymentRefundId>
    paymentId: PaymentId
    amount: number
    reason: string
    refundedBy: AuthUserId
    refundedAt: Date
}

export type PaymentRefundTableInsert = Insertable<PaymentRefundTable>
export type PaymentRefundTableSelect = Selectable<PaymentRefundTable>
export type PaymentRefundTableUpdate = Updateable<PaymentRefundTable>

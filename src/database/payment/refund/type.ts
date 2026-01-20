import { z } from 'zod'

export const PaymentRefundId = z.coerce.number().brand<'payment.refund.id'>()
export type PaymentRefundId = z.infer<typeof PaymentRefundId>

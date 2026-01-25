import z from 'zod'
import { BookingId } from '../../../database/booking/booking/type.js'
import { PaymentMethod } from '../../../database/payment/payment/type.js'

export const PaymentMethodRequest = z.object({
    bookingId: BookingId,
    method: PaymentMethod,
})

export type PaymentMethodRequest = z.infer<typeof PaymentMethodRequest>

export const VnPayIpnRequest = z.object({
    vnp_OrderInfo: z.string(),
    vnp_Amount: z.string(),
    vnp_BankCode: z.string(),
    vnp_BankTranNo: z.string(),
    vnp_BankOrderNo: z.string(),
    vnp_TransactionNo: z.string(),
    vnp_TransactionStatus: z.string(),
    vnp_TransactionType: z.string(),
    vnp_TransactionDate: z.string(),
})

export type VnPayIpnRequest = z.infer<typeof VnPayIpnRequest>

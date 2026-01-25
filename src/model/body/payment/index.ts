import z from 'zod'

export const PaymentMethodResponse = z.object({
    message: z.string(),
    paymentUrl: z.string().optional(),
})

export type PaymentMethodResponse = z.infer<typeof PaymentMethodResponse>

export const VnPayIpnResponse = z.object({
    RspCode: z.string().optional(),
    Message: z.string().optional(),
})

export type VnPayIpnResponse = z.infer<typeof VnPayIpnResponse>

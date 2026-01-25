import { dal } from '../../database/index.js'
import { PaymentStatus } from '../../database/payment/payment/type.js'
import { db } from '../../datasource/db.js'
import { utils } from '../../utils/index.js'
import {
    buildSignData,
    createSecureHash,
    hashSecret,
    normalizeQueryValue,
    returnUrl,
    tmnCode,
} from './common.js'
const vnpayUrl = process.env.VNPAY_URL ?? ''

export function initiatePayment(amount: number, transactionCode: string, ip: string) {
    const now = utils.time.getNow()

    const vnpParams: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Amount: String(amount * 100),
        vnp_CurrCode: 'VND',
        vnp_TxnRef: transactionCode,
        vnp_OrderInfo: 'Payment for ticket',
        vnp_Locale: 'vn',
        vnp_IpAddr: ip,
        vnp_OrderType: 'other',
        vnp_CreateDate: now.format('YYYYMMDDHHmmss'),
        vnp_ExpireDate: now.add(60 * 60 * 1000, 'seconds').format('YYYYMMDDHHmmss'),
        vnp_ReturnUrl: returnUrl,
    }

    const signData = buildSignData(vnpParams)
    const secureHash = createSecureHash(signData, hashSecret)

    return vnpayUrl + '?' + signData + `&vnp_SecureHash=${secureHash}`
}

export async function verifyIpn(query: Record<string, string>) {
    const rawQuery = query as Record<string, string>
    const vnpParams: Record<string, string> = {}

    for (const [key, value] of Object.entries(rawQuery)) {
        vnpParams[key] = normalizeQueryValue(value)
    }

    const secureHash = vnpParams.vnp_SecureHash ?? ''
    delete vnpParams.vnp_SecureHash
    delete vnpParams.vnp_SecureHashType

    const signData = buildSignData(vnpParams)
    const signed = createSecureHash(signData, hashSecret)

    if (secureHash !== signed) {
        return { RspCode: '97', Message: 'Invalid checksum' }
    }

    const { vnp_ResponseCode, vnp_TxnRef, vnp_Amount } = vnpParams

    return db.transaction().execute(async tx => {
        const payment = await dal.payment.payment.query.getPayment(undefined, vnp_TxnRef, tx)

        if (!payment) {
            return { RspCode: '01', Message: 'Order not found' }
        }

        if (payment.status === PaymentStatus.enum.success) {
            return { RspCode: '00', Message: 'Already confirmed' }
        }

        if (payment.amount !== Number(vnp_Amount) / 100) {
            return { RspCode: '04', Message: 'Invalid amount' }
        }

        if (vnp_ResponseCode !== '00') {
            await dal.payment.payment.cmd.updatePaymentStatusFailed(vnp_TxnRef, tx)
            return { RspCode: '00', Message: 'Payment failed recorded' }
        }

        await dal.payment.payment.cmd.updatePaymentStatusSuccess(vnp_TxnRef, tx)
        return { RspCode: '00', Message: 'Confirm Success' }
    })
}

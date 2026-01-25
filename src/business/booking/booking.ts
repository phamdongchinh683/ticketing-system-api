import { dal } from '../../database/index.js'
import { BookingRequest } from '../../model/body/booking/index.js'
import { AuthUserId } from '../../database/auth/user/type.js'

export async function initBooking(params: BookingRequest, userId: AuthUserId) {
    return await dal.booking.booking.cmd.createOne(params, userId)
}

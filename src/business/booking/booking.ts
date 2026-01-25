import { dal } from '../../database/index.js'
import { BookingRequest } from '../../model/body/booking/index.js'
import { AuthUserId } from '../../database/auth/user/type.js'
import { BookingType } from '../../database/booking/booking/type.js'

export async function initBooking(params: BookingRequest, userId: AuthUserId) {
    const { type, returnBound } = params
    if (type === BookingType.enum.one_way) {
        return await dal.booking.booking.cmd.createOneWayBooking(params, userId)
    } else if (type === BookingType.enum.round_trip && returnBound) {
        return await dal.booking.booking.cmd.createRoundTripBooking(params, userId)
    }
}

import { dal } from '../../index.js'
import { TripSeatParam } from '../../../model/params/trip/index.js'

export async function getSeats(params: TripSeatParam) {
    return await dal.organization.seat.query.getAvailableSeats(params)
}

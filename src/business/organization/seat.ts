import { dal } from '../../database/index.js'
import { TripSeatParam } from '../../model/params/trip/index.js'

export async function getSeats(params: TripSeatParam) {
    return {
        seats: await dal.organization.seat.cmd.findAll(params),
    }
}

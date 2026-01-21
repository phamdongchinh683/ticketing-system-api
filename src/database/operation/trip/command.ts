import { TripFilter } from '../../../model/query/trip/index.js'
import { dal } from '../../index.js'

export async function getManyByFilter(params: TripFilter) {
    return dal.operation.trip.query.findAllByFilter(params)
}

import { dal } from '../../database/index.js'
import { TripFilter } from '../../model/query/trip/index.js'

export async function getTrips(query: TripFilter) {
    const limit = query.limit ?? 10
    const trips = await dal.operation.trip.cmd.getManyByFilter(query)

    const hasNextPage = trips.length > limit
    const data = hasNextPage ? trips.slice(0, limit) : trips

    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        trips: data,
        next,
    }
}

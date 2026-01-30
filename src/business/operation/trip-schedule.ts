import { TripScheduleFilter } from '../../model/query/trip-schedule/index.js'
import { dal } from '../../database/index.js'

export async function getTripSchedules(query: TripScheduleFilter) {
    const limit = query.limit ?? 10
    const tripSchedules = await dal.operation.tripSchedule.cmd.getTripSchedules(query)

    const hasNextPage = tripSchedules.length > limit
    const data = hasNextPage ? tripSchedules.slice(0, limit) : tripSchedules

    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        trip: data,
        next,
    }
}

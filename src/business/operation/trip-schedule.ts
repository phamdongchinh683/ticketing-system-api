import { TripScheduleFilter } from '../../model/query/trip-schedule/index.js'
import { dal } from '../../database/index.js'
import { OrganizationBusCompanyId } from '../../database/organization/bus_company/type.js'
import { utils } from '../../utils/index.js'

export async function getTripSchedules(query: TripScheduleFilter) {
    const tripSchedules = await dal.operation.tripSchedule.cmd.getTripSchedules(query)
    const { data, next } = utils.common.paginateByCursor(tripSchedules, query.limit)

    return {
        trip: data,
        next: next,
    }
}

export async function getTripSchedulesByCompanyId(
    query: TripScheduleFilter,
    companyId: OrganizationBusCompanyId
) {
    const tripSchedules = await dal.operation.tripSchedule.query.findAllByFilter(query, companyId)

    const { data, next } = utils.common.paginateByCursor(tripSchedules, query.limit)

    return {
        trip: data,
        next: next,
    }
}

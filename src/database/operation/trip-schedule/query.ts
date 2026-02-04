import { db } from '../../../datasource/db.js'
import { TripScheduleFilter } from '../../../model/query/trip-schedule/index.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'

export async function findAllByFilter(
    query: TripScheduleFilter,
    companyId?: OrganizationBusCompanyId
) {
    const { limit = 10, next, from, to, date, orderBy } = query

    return db
        .selectFrom('operation.trip_schedule as ts')
        .innerJoin('operation.route as r', 'r.id', 'ts.routeId')
        .innerJoin('organization.bus_company as bc', 'bc.id', 'ts.companyId')
        .select([
            'ts.id',
            'ts.departureTime',
            'bc.name',
            'bc.logoUrl',
            'bc.hotline',
            'r.fromLocation',
            'r.toLocation',
            'r.distanceKm',
            'r.durationMinutes',
        ])

        .where(eb => {
            const cond = []
            cond.push(eb('ts.status', '=', true))
            if (from) {
                cond.push(eb('r.fromLocation', '=', from))
            }
            if (to) {
                cond.push(eb('r.toLocation', '=', to))
            }
            if (date) {
                cond.push(eb('ts.startDate', '<=', date))
                cond.push(eb('ts.endDate', '>=', date))
            }

            if (companyId) {
                cond.push(eb('ts.companyId', '=', companyId))
            }
            if (next) {
                cond.push(eb('ts.id', '>', next))
            }
            return eb.and(cond)
        })
        .limit(limit + 1)
        .orderBy('ts.departureTime', orderBy)
        .execute()
}

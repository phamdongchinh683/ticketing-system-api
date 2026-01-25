import { Transaction } from 'kysely'
import { db } from '../../../datasource/db.js'
import { TripFilter } from '../../../model/query/trip/index.js'
import { OperationTripStatus } from '../trip/type.js'
import { OperationTripId } from '../trip/type.js'
import { Database } from '../../../datasource/type.js'

export async function findAllByFilter(filter: TripFilter) {
    return db
        .selectFrom('operation.trip as t')
        .leftJoin('operation.route as r', 't.routeId', 'r.id')
        .leftJoin('booking.ticket as tk', 'tk.tripId', 't.id')
        .where(eb => {
            const cond = []
            if (filter.from) cond.push(eb('r.fromLocation', '=', filter.from))
            if (filter.to) cond.push(eb('r.toLocation', '=', filter.to))
            if (filter.date) cond.push(eb('t.departureDate', '=', filter.date))
            cond.push(eb('t.status', '=', OperationTripStatus.enum.scheduled))
            return eb.and(cond)
        })
        .select(['t.id', 'r.fromLocation', 'r.toLocation', 't.status', 'r.durationMinutes'])
        .execute()
}

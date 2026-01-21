import { sql } from 'kysely'
import { db } from '../../../datasource/db.js'
import { TripFilter } from '../../../model/query/trip/index.js'
import { OperationTripStatus } from './type.js'

export async function findAllByFilter(filter: TripFilter) {
    const limit = filter.limit ? filter.limit : 10
    return db
        .selectFrom('operation.trip as t')
        .innerJoin('operation.route as r', 't.routeId', 'r.id')
        .innerJoin('operation.trip_price as tp', 'tp.tripId', 't.id')
        .innerJoin('organization.vehicle as v', 'v.id', 't.vehicleId')
        .innerJoin('organization.bus_company as bc', 'bc.id', 'v.companyId')
        .where(eb => {
            const cond = []

            cond.push(eb('t.status', '=', OperationTripStatus.enum.scheduled))
            cond.push(eb('r.fromLocation', '=', filter.from))
            cond.push(eb('r.toLocation', '=', filter.to))
            cond.push(eb('t.departureDate', '=', filter.date))

            if (filter.cursor) {
                cond.push(
                    eb.or([
                        eb(sql<number>`min(${sql.ref('tp.price')})`, '>', filter.cursor.price),
                        eb.and([
                            eb(sql<number>`min(${sql.ref('tp.price')})`, '=', filter.cursor.price),
                            eb('t.id', '>', filter.cursor.id),
                        ]),
                    ])
                )
            }

            return eb.and(cond)
        })
        .select([
            't.id',
            'bc.name as companyName',
            'bc.logoUrl',
            'v.plateNumber',
            'v.type',
            'v.totalSeats',
            'r.fromLocation',
            'r.toLocation',
            'r.distanceKm',
            'r.durationMinutes',
            'tp.currency',
            sql<number>`min(${sql.ref('tp.price')})`.as('price'),
        ])
        .groupBy([
            't.id',
            'bc.name',
            'bc.logoUrl',
            'v.plateNumber',
            'v.type',
            'v.totalSeats',
            'r.fromLocation',
            'r.toLocation',
            'r.distanceKm',
            'r.durationMinutes',
            'tp.currency',
        ])
        .orderBy(sql<number>`min(${sql.ref('tp.price')})`, filter.orderBy)
        .orderBy('t.id', filter.orderBy)
        .limit(limit + 1)
        .execute()
}

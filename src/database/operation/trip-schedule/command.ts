import { db } from '../../../datasource/db.js'
import { OperationTripScheduleId } from './type.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { TripScheduleFilter } from '../../../model/query/trip-schedule/index.js'
import { dal } from '../../index.js'

export async function findByIdAndDate(
    params: {
        id: OperationTripScheduleId
        date: Date
    },
    trx?: Transaction<Database>
) {
    const { id, date } = params
    return (trx ?? db)
        .selectFrom('operation.trip_schedule')
        .where(eb => {
            const cond = []
            cond.push(eb('id', '=', id))
            cond.push(eb('startDate', '<=', date))
            cond.push(eb('endDate', '>=', date))
            cond.push(eb('status', '=', true))
            return eb.and(cond)
        })
        .selectAll()
        .executeTakeFirstOrThrow()
}

export async function getTripSchedules(query: TripScheduleFilter) {
    return await dal.operation.tripSchedule.query.findAllByFilter(query)
}

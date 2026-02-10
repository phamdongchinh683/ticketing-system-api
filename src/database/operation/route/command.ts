import { db } from '../../../datasource/db.js'
import { OperationTripId } from '../trip/type.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { AuthUserId } from '../../auth/user/type.js'

export async function getRouterByDriverIdAndTripId(
    params: {
        driverId: AuthUserId
        tripId: OperationTripId
    },
    trx?: Transaction<Database>
) {
    const { driverId, tripId } = params
    return (trx ?? db)
        .selectFrom('operation.route as r')
        .innerJoin('operation.trip as t', 't.routeId', 'r.id')
        .innerJoin('operation.trip_stop_template as tst', 'tst.routeId', 'r.id')
        .innerJoin('operation.station as s', 's.id', 'tst.stationId')
        .where(eb => {
            const cond = []
            cond.push(eb('t.id', '=', tripId))
            cond.push(eb('t.driverId', '=', driverId))
            return eb.and(cond)
        })
        .select(['s.address', 's.city', 'tst.stopOrder'])
        .orderBy('tst.stopOrder')
        .execute()
}

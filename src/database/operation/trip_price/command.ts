import { Transaction } from 'kysely'
import { OperationTripId } from '../trip/type.js'
import { Database } from '../../../datasource/type.js'
import { OperationStationId } from '../station/type.js'
import { db } from '../../../datasource/db.js'

export async function getPriceByTrip(
    params: {
        tripId: OperationTripId
        fromStationId: OperationStationId
        toStationId: OperationStationId
    },
    trx: Transaction<Database>
) {
    const { tripId, fromStationId, toStationId } = params
    return trx
        .selectFrom('operation.trip_price as tp')
        .select(['tp.price'])
        .where(eb => {
            const cond = []
            cond.push(eb('tp.tripId', '=', tripId))
            cond.push(eb('tp.fromStationId', '=', fromStationId))
            cond.push(eb('tp.toStationId', '=', toStationId))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

export async function findOneByTripId(tripId: OperationTripId, trx?: Transaction<Database>) {
    return (trx ?? db)
        .selectFrom('operation.trip_price as tp')
        .selectAll()
        .where('tp.tripId', '=', tripId)
        .executeTakeFirstOrThrow()
}

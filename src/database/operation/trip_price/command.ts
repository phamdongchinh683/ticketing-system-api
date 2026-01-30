import { Transaction } from 'kysely'
import { OperationTripId } from '../trip/type.js'
import { Database } from '../../../datasource/type.js'
import { OperationStationId } from '../station/type.js'
import { db } from '../../../datasource/db.js'
import { OperationTripPriceTableInsert } from './table.js'

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

export async function createTripPrice(
    params: OperationTripPriceTableInsert,
    trx: Transaction<Database>
) {
    return trx
        .insertInto('operation.trip_price')
        .values(params)
        .returning('id')
        .executeTakeFirstOrThrow()
}

export async function createTripPriceBulk(
    params: OperationTripPriceTableInsert[],
    trx: Transaction<Database>
) {
    const data = params
        .map(
            param =>
                Object.fromEntries(
                    Object.entries(param).filter(
                        ([, value]) => value !== null && value !== undefined
                    )
                ) as OperationTripPriceTableInsert
        )
        .filter(param => Object.keys(param).length > 0)

    if (data.length === 0) {
        return []
    }

    return trx
        .insertInto('operation.trip_price')
        .values(data)
        .returning('id')
        .executeTakeFirstOrThrow()
}

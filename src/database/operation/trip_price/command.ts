import { sql, Transaction } from 'kysely'
import { OperationTripId } from '../trip/type.js'
import { Database } from '../../../datasource/type.js'

export async function countPriceByTripIds(tripIds: OperationTripId[], trx: Transaction<Database>) {
    return trx
        .selectFrom('operation.trip_price as tp')
        .select(sql<number>`count(*)`.as('count'))
        .where('tp.tripId', 'in', tripIds)
        .executeTakeFirstOrThrow()
}

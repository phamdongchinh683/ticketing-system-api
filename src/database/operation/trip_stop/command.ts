import { Transaction } from 'kysely'
import { dal } from '../../index.js'
import { OperationStationId } from '../station/type.js'
import { OperationTripId } from '../trip/type.js'
import { OperationTripStopTableInsert } from './table.js'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'

export async function findAllPickupStop(id: OperationTripId) {
    return await dal.operation.tripStop.query.getPickupStopsByTripId(id)
}

export async function findAllDropoffStop(
    tripId: OperationTripId,
    fromStationId: OperationStationId,
    stopOrder: number
) {
    return await dal.operation.tripStop.query.getDropoffStopsWithPrice(
        tripId,
        fromStationId,
        stopOrder
    )
}

export async function createTripStop(
    params: OperationTripStopTableInsert,
    trx: Transaction<Database>
) {
    return trx
        .insertInto('operation.trip_stop')
        .values(params)
        .returning('id')
        .executeTakeFirstOrThrow()
}

export async function createTripStopBulk(
    params: OperationTripStopTableInsert[],
    trx: Transaction<Database>
) {
    const data = params.map(
        param =>
            Object.fromEntries(
                Object.entries(param).filter(([, value]) => !_.isNil(value))
            ) as OperationTripStopTableInsert
    )
    const dataFiltered = data.filter(param => Object.keys(param).length > 0)
    if (dataFiltered.length === 0) {
        return []
    }
    return trx
        .insertInto('operation.trip_stop')
        .values(dataFiltered)
        .returning('id')
        .execute()
}

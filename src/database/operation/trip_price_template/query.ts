import { Transaction } from 'kysely'
import { db } from '../../../datasource/db.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'
import { OperationStationId } from '../station/type.js'
import { OperationTripId } from '../trip/type.js'

export async function getPickupStopsByTripId(tripId: OperationTripId) {
    return db
        .selectFrom('operation.trip_stop as ts')
        .innerJoin('operation.station as s', 'ts.stationId', 's.id')
        .where(eb => eb.and([eb('ts.tripId', '=', tripId), eb('ts.allowPickup', '=', true)]))
        .select([
            'ts.stopOrder',
            'ts.stationId',
            's.address',
            's.city',
            'ts.stopOrder',
            'ts.arrivalTime',
            'ts.departureTime',
        ])
        .orderBy('ts.stopOrder')
        .execute()
}

export async function getDropoffStopsWithPrice(
    tripId: OperationTripId,
    fromStationId: OperationStationId,
    stopOrder: number
) {
    return db
        .selectFrom('operation.trip_stop as ts')
        .innerJoin('operation.station as s', 'ts.stationId', 's.id')
        .innerJoin('operation.trip_price as tp', join =>
            join
                .onRef('tp.tripId', '=', 'ts.tripId')
                .on('tp.fromStationId', '=', fromStationId)
                .onRef('tp.toStationId', '=', 'ts.stationId')
        )
        .where(eb =>
            eb.and([
                eb('ts.tripId', '=', tripId),
                eb('ts.allowDropoff', '=', true),
                eb('ts.stopOrder', '>', stopOrder),
            ])
        )
        .select([
            'ts.stationId as stopOrder',
            's.address',
            's.city',
            'ts.stopOrder as stationId',
            'ts.arrivalTime',
            'ts.departureTime',
            'tp.price',
            'tp.currency',
        ])
        .orderBy('ts.stopOrder')
        .execute()
}

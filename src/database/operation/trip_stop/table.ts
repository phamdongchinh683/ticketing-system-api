import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { OperationTripStopId } from './type.js'
import { OperationStationId } from '../station/type.js'
import { OperationTripId } from '../trip/type.js'

export interface OperationTripStopTable extends Timestamps {
    id: GeneratedAlways<OperationTripStopId>
    tripId: OperationTripId
    stationId: OperationStationId
    stopOrder: number
    arrivalTime: Date | null
    departureTime: Date | null
    allowPickup: boolean
    allowDropoff: boolean
}

export type OperationTripStopTableInsert = Insertable<OperationTripStopTable>
export type OperationTripStopTableSelect = Selectable<OperationTripStopTable>
export type OperationTripStopTableUpdate = Updateable<OperationTripStopTable>

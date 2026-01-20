import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { OperationTripEventId, OperationTripEventType } from './type.js'
import { OperationTripId } from '../trip/type.js'

export interface OperationTripEventTable extends Timestamps {
    id: GeneratedAlways<OperationTripEventId>
    tripId: OperationTripId
    event: OperationTripEventType
    note: string
}

export type OperationTripEventTableInsert = Insertable<OperationTripEventTable>
export type OperationTripEventTableSelect = Selectable<OperationTripEventTable>
export type OperationTripEventTableUpdate = Updateable<OperationTripEventTable>

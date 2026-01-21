import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { OperationTripPriceId } from './type.js'
import { OperationStationId } from '../station/type.js'
import { OperationTripId } from '../trip/type.js'

export interface OperationTripPriceTable extends Timestamps {
    id: GeneratedAlways<OperationTripPriceId>
    tripId: OperationTripId
    fromStationId: OperationStationId
    toStationId: OperationStationId
    price: number
    currency: string
    isActive: boolean
}

export type OperationTripPriceTableInsert = Insertable<OperationTripPriceTable>
export type OperationTripPriceTableSelect = Selectable<OperationTripPriceTable>
export type OperationTripPriceTableUpdate = Updateable<OperationTripPriceTable>

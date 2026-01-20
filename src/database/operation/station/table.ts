import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { OperationStationId } from './type.js'

export interface OperationStationTable extends Timestamps {
    id: GeneratedAlways<OperationStationId>
    name: string
    city: string
}

export type OperationStationTableInsert = Insertable<OperationStationTable>
export type OperationStationTableSelect = Selectable<OperationStationTable>
export type OperationStationTableUpdate = Updateable<OperationStationTable>

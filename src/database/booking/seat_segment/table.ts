import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { BookingSeatSegmentId } from './type.js'
import { OrganizationSeatId } from '../../organization/seat/type.js'
import { OperationTripId } from '../../operation/trip/type.js'
import { OperationStationId } from '../../operation/station/type.js'
import { BookingTicketId } from '../ticket/type.js'

export interface BookingSeatSegmentTable extends Timestamps {
    id: GeneratedAlways<BookingSeatSegmentId>
    tripId: OperationTripId
    seatId: OrganizationSeatId
    fromStationId: OperationStationId
    toStationId: OperationStationId
    ticketId: BookingTicketId
}

export type BookingSeatSegmentTableInsert = Insertable<BookingSeatSegmentTable>
export type BookingSeatSegmentTableSelect = Selectable<BookingSeatSegmentTable>
export type BookingSeatSegmentTableUpdate = Updateable<BookingSeatSegmentTable>

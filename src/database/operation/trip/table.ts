import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { OperationTripId, OperationTripStatus } from './type.js'
import { OperationRouteId } from '../route/type.js'
import { OrganizationVehicleId } from '../../organization/vehicle/type.js'
import { AuthUserId } from '../../auth/user/type.js'

export interface OperationTripTable extends Timestamps {
    id: GeneratedAlways<OperationTripId>
    routeId: OperationRouteId
    vehicleId: OrganizationVehicleId
    driverId: AuthUserId
    departureDate: Date
    status: OperationTripStatus
    password: string
}

export type OperationTripTableInsert = Insertable<OperationTripTable>
export type OperationTripTableSelect = Selectable<OperationTripTable>
export type OperationTripTableUpdate = Updateable<OperationTripTable>

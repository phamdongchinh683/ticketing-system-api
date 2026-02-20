import { OrganizationVehicleId } from '../../../database/organization/vehicle/type.js'
import z from 'zod'

export const VehicleIdParam = z.object({
    id: OrganizationVehicleId,
})
export type VehicleIdParam = z.infer<typeof VehicleIdParam>

import {
    OrganizationVehicleId,
    OrganizationVehicleStatus,
    OrganizationVehicleType,
} from '../../../database/organization/vehicle/type.js'
import z from 'zod'

export const VehicleFilter = z.object({
    type: OrganizationVehicleType.optional(),
    status: OrganizationVehicleStatus.optional(),
    limit: z.coerce.number().optional().default(10),
    next: OrganizationVehicleId.optional(),
})
export type VehicleFilter = z.infer<typeof VehicleFilter>

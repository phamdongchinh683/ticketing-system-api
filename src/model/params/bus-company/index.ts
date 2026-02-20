import { OrganizationBusCompanyId } from '../../../database/organization/bus_company/type.js'
import z from 'zod'

export const BusCompanyIdParam = z.object({
    id: OrganizationBusCompanyId,
})
export type BusCompanyIdParam = z.infer<typeof BusCompanyIdParam>

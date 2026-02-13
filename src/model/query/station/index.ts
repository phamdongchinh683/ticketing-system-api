import z from 'zod'
import { OperationStationId } from '../../../database/operation/station/type.js'

export const StationFilter = z.object({
    city: z.string().optional(),
    limit: z.coerce.number().optional().default(10),
    next: OperationStationId.optional(),
})

export type StationFilter = z.infer<typeof StationFilter>

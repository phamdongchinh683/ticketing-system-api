import { OperationTripScheduleId } from '../../../database/operation/trip-schedule/type.js'
import z from 'zod'
import { OrderBy } from '../../common.js'

export const TripScheduleFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: OperationTripScheduleId.optional(),
    from: z.string(),
    to: z.string(),
    date: z.coerce.date(),
    orderBy: OrderBy,
})

export type TripScheduleFilter = z.infer<typeof TripScheduleFilter>

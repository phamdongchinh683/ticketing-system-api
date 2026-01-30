import z from 'zod'
import { OperationTripScheduleId } from '../../../database/operation/trip-schedule/type.js'

export const TripScheduleResponse = z.object({
    trip: z.array(
        z.object({
            id: OperationTripScheduleId,
            departureTime: z.string(),
            name: z.string(),
            logoUrl: z.string(),
            hotline: z.string(),
            fromLocation: z.string(),
            toLocation: z.string(),
            distanceKm: z.number(),
            durationMinutes: z.number(),
        })
    ),
    next: OperationTripScheduleId.nullable(),
})

export type TripScheduleResponse = z.infer<typeof TripScheduleResponse>

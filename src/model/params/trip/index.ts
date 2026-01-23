import { OperationTripId } from '../../../database/operation/trip/type.js'
import z from 'zod'

export const TripIdParam = z.object({
    id: OperationTripId,
})
export type TripIdParam = z.infer<typeof TripIdParam>

export const TripSeatParam = z.object({
    id: OperationTripId,
    pickup: z.coerce.number().int().optional(),
    dropoff: z.coerce.number().int().optional(),
})

export type TripSeatParam = z.infer<typeof TripSeatParam>

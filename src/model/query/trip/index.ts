import z from 'zod'
import { OrderBy } from '../../common.js'
import { OperationTripId } from '../../../database/operation/trip/type.js'

export const TripFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: OperationTripId.optional(),
    from: z.string(),
    to: z.string(),
    date: z.coerce.date(),
    orderByPrice: OrderBy,
})

export type TripFilter = z.infer<typeof TripFilter>

export const TripPickupQuery = z.object({
    pickupOrder: z.coerce.number().int(),
})

export type TripPickupQuery = z.infer<typeof TripPickupQuery>

export const TripQuery = z.object({
    id: OperationTripId,
})

export type TripQuery = z.infer<typeof TripQuery>

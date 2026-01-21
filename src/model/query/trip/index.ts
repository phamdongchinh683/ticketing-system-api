import z from 'zod'
import { OrderBy } from '../../common.js'
import { OperationTripId } from '../../../database/operation/trip/type.js'

export const TripFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: OperationTripId.optional(),
    from: z.string().toLowerCase(),
    to: z.string().toLowerCase(),
    date: z.coerce.date(),
    orderBy: OrderBy,
})

export type TripFilter = z.infer<typeof TripFilter>

export const TripIdPickupParam = z.object({
    id: OperationTripId,
})

export type TripIdPickupParam = z.infer<typeof TripIdPickupParam>

export const TripIdDropoffParam = z.object({
    id: OperationTripId,
    stopOrder: z.coerce.number(),
})

export type TripIdDropoffParam = z.infer<typeof TripIdDropoffParam>

export const TripQuery = z.object({
    id: OperationTripId,
})

export type TripQuery = z.infer<typeof TripQuery>

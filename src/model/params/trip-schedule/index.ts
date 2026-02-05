import { OperationTripScheduleId } from '../../../database/operation/trip-schedule/type.js'
import { OperationTripId } from '../../../database/operation/trip/type.js'
import z from 'zod'

export const TripScheduleIdParam = z.object({
    id: OperationTripScheduleId,
})

export type TripScheduleIdParam = z.infer<typeof TripScheduleIdParam>

export const TripScheduleTripIdParam = z.object({
    id: OperationTripScheduleId,
    tripId: OperationTripId,
})

export type TripScheduleTripIdParam = z.infer<typeof TripScheduleTripIdParam>

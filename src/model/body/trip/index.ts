import z from 'zod'
import { OperationTripId } from '../../../database/operation/trip/type.js'
import { OrganizationVehicleType } from '../../../database/organization/vehicle/type.js'

export const TripStopCursor = z
    .object({
        id: OperationTripId,
        price: z.number(),
    })
    .optional()
    .nullable()

export type TripStopCursor = z.infer<typeof TripStopCursor>

export const TripResponse = z.object({
    trips: z.array(
        z.object({
            id: OperationTripId,
            fromLocation: z.string(),
            toLocation: z.string(),
            distanceKm: z.number(),
            durationMinutes: z.number(),
            companyName: z.string(),
            logoUrl: z.string(),
            plateNumber: z.string(),
            type: OrganizationVehicleType,
            totalSeats: z.number(),
            currency: z.string(),
            price: z.number(),
        })
    ),
    next: TripStopCursor,
    hasNextPage: z.boolean(),
})

export type TripResponse = z.infer<typeof TripResponse>

export const TripStopResponse = z.object({
    tripStops: z.array(
        z.object({
            address: z.string(),
            city: z.string(),
            stopOrder: z.number(),
            arrivalTime: z.date().nullable(),
            departureTime: z.date().nullable(),
        })
    ),
})

export type TripStopResponse = z.infer<typeof TripStopResponse>

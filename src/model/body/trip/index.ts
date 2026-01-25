import z from 'zod'
import { OperationTripId } from '../../../database/operation/trip/type.js'
import { OrganizationVehicleType } from '../../../database/organization/vehicle/type.js'
import { OrganizationSeatId } from '../../../database/organization/seat/type.js'
import { OperationStationId } from '../../../database/operation/station/type.js'

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
        })
    ),
    next: OperationTripId.nullable(),
})

export type TripResponse = z.infer<typeof TripResponse>

export const TripStopResponse = z.object({
    tripStops: z.array(
        z.object({
            address: z.string(),
            city: z.string(),
            stationId: OperationStationId,
            arrivalTime: z.date().nullable(),
            stopOrder: z.number(),
            departureTime: z.date().nullable(),
            price: z.number(),
        })
    ),
})

export type TripStopResponse = z.infer<typeof TripStopResponse>

export const TripStopPickupResponse = z.object({
    tripStops: z.array(
        z.object({
            address: z.string(),
            city: z.string(),
            stopOrder: z.number(),
            stationId: OperationStationId,
            arrivalTime: z.date().nullable(),
            departureTime: z.date().nullable(),
        })
    ),
})

export type TripStopPickupResponse = z.infer<typeof TripStopPickupResponse>

export const TripSeatResponse = z.object({
    seats: z.array(
        z.object({
            id: OrganizationSeatId,
            seatNumber: z.string(),
        })
    ),
})

export type TripSeatResponse = z.infer<typeof TripSeatResponse>

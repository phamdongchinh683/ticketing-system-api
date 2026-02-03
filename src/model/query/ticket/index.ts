import { BookingTicketId, BookingTicketStatus } from '../../../database/booking/ticket/type.js'
import z from 'zod'
import { BookingType } from '../../../database/booking/booking/type.js'
import { OperationTripId } from '../../../database/operation/trip/type.js'

export const TicketFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: BookingTicketId.optional(),
    type: BookingType.optional(),
    status: BookingTicketStatus.optional(),
})

export type TicketFilter = z.infer<typeof TicketFilter>


export const PassengerTicketFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: BookingTicketId.optional(),
    phoneNumber: z.string().optional(),
})

export type PassengerTicketFilter = z.infer<typeof PassengerTicketFilter>

export const PassengerCheckInParam = z.object({
    id: BookingTicketId,
    tripId: OperationTripId.optional(),
})
export type PassengerCheckInParam = z.infer<typeof PassengerCheckInParam>
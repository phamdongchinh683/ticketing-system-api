import { BookingTicketId, BookingTicketStatus } from '../../../database/booking/ticket/type.js'
import z from 'zod'
import { BookingType } from '../../../database/booking/booking/type.js'

export const TicketFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: BookingTicketId.optional(),
    type: BookingType.optional(),
    status: BookingTicketStatus.optional(),
})

export type TicketFilter = z.infer<typeof TicketFilter>

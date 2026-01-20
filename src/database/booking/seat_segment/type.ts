import { z } from 'zod'

export const BookingSeatSegmentId = z.coerce.number().brand<'booking.seat_segment.id'>()
export type BookingSeatSegmentId = z.infer<typeof BookingSeatSegmentId>

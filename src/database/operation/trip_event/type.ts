import { z } from 'zod'

export const OperationTripEventId = z.coerce.number().brand<'operation.trip_event.id'>()
export type OperationTripEventId = z.infer<typeof OperationTripEventId>

export const OperationTripEventType = z.enum(['departed', 'delayed', 'arrived', 'cancelled'])
export type OperationTripEventType = z.infer<typeof OperationTripEventType>

import { z } from 'zod'

export const OperationTripStopId = z.coerce.number().brand<'operation.trip_stop.id'>()
export type OperationTripStopId = z.infer<typeof OperationTripStopId>

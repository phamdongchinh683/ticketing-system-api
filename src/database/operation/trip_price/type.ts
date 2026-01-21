import { z } from 'zod'

export const OperationTripPriceId = z.coerce.number().brand<'operation.trip_price.id'>()
export type OperationTripPriceId = z.infer<typeof OperationTripPriceId>

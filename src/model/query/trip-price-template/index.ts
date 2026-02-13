import z from 'zod'
import { OperationTripPriceTemplateId } from '../../../database/operation/trip_price_template/type.js'

export const TripPriceTemplateFilter = z.object({
    limit: z.coerce.number().optional().default(10),
    next: OperationTripPriceTemplateId.optional(),
})

export type TripPriceTemplateFilter = z.infer<typeof TripPriceTemplateFilter>

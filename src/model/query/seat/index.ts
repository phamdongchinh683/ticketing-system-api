import z from 'zod'

export const TripSeatQuery = z.object({
    pickup: z.coerce.number().int(),
    dropoff: z.coerce.number().int(),
})

export type TripSeatQuery = z.infer<typeof TripSeatQuery>

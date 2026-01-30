import { OperationTripId } from "../../../database/operation/trip/type.js"
import z from "zod"
export const SeatBody = z.object({
    id: OperationTripId,
    date: z.coerce.date(),
})

export type SeatBody = z.infer<typeof SeatBody>
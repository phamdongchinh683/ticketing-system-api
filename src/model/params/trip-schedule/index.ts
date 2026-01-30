import { OperationTripScheduleId } from "../../../database/operation/trip-schedule/type.js"
import z from "zod"

export const TripScheduleIdParam = z.object({
    id: OperationTripScheduleId,
})

export type TripScheduleIdParam = z.infer<typeof TripScheduleIdParam>
import { OperationTripScheduleId } from '../../../database/operation/trip-schedule/type.js'
import { OperationTripStopTemplateId } from '../../../database/operation/trip-stop-template/type.js'
import z from 'zod'

export const TripStopTemplateIdParam = z.object({
    id: OperationTripScheduleId,
    tripStopTemplateId: OperationTripStopTemplateId,
})

export type TripStopTemplateIdParam = z.infer<typeof TripStopTemplateIdParam>

import { z } from 'zod'

export const OperationRouteStopResponse = z.object({
    address: z.string(),
    city: z.string(),
    stopOrder: z.number(),
})
export type OperationRouteStopResponse = z.infer<typeof OperationRouteStopResponse>

export const OperationRouteResponse = z.object({
    stops: z.array(OperationRouteStopResponse),
})
export type OperationRouteResponse = z.infer<typeof OperationRouteResponse>


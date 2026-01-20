import { z } from 'zod'

export const OrganizationSeatId = z.coerce.number().brand<'organization.seat.id'>()
export type OrganizationSeatId = z.infer<typeof OrganizationSeatId>

import z from 'zod'
import { AuthUserId } from '../../../database/auth/user/type.js'

export const CompanyAdminQuery = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    next: AuthUserId.nullable().optional(),
})

export type CompanyAdminQuery = z.infer<typeof CompanyAdminQuery>

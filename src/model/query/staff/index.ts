import z from 'zod'
import { AuthUserStatus } from '../../../database/auth/user/type.js'
import { Email, Phone } from '../../common.js'
import { AuthStaffDetailId } from '../../../database/auth/staff_detail/type.js'

export const StaffRoleQuery = z.object({
    position: z.string().optional(),
    department: z.string().optional(),
    status: AuthUserStatus.optional(),
    code: z.string().optional(),
    email: Email.optional(),
    phone: Phone.optional(),
    identityNumber: z.string().min(12).nullable().optional(),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    next: AuthStaffDetailId.nullable().optional(),
})

export type StaffRoleQuery = z.infer<typeof StaffRoleQuery>

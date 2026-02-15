import { Email, Phone } from '../../common.js'
import z from 'zod'
import { AuthStaffDetailId } from '../../../database/auth/staff_detail/type.js'
import { AuthUserId } from '../../../database/auth/user/type.js'

export const StaffRoleBody = z.object({
    fullName: z.string().min(7).nullable().optional(),
    email: Email,
    phone: Phone,
    staffCode: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    identityNumber: z.string().min(12).nullable().optional(),
    hireDate: z.coerce.date().nullable().optional(),
})

export type StaffRoleBody = z.infer<typeof StaffRoleBody>

export const StaffListResponse = z.object({
    staff: z.array(
        StaffRoleBody.extend({
            id: AuthStaffDetailId,
            userId: AuthUserId,
        })
    ),
    next: AuthStaffDetailId.nullable(),
})

export type StaffListResponse = z.infer<typeof StaffListResponse>

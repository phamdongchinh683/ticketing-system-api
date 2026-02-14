import { AuthUserId, AuthUserStatus } from '../../../database/auth/user/type.js'
import { z } from 'zod'
import { OrganizationBusCompanyId } from '../../../database/organization/bus_company/type.js'
import { Email, Phone } from '../../common.js'
import { AuthStaffProfileId, AuthStaffProfileRole } from '../../../database/auth/staff_profile/type.js'

export const ProfileUpdateBody = z.object({
    fullName: z.string().optional(),
    email: Email.optional(),
    phone: Phone.optional(),
    status: AuthUserStatus.optional(),
    companyId: OrganizationBusCompanyId.nullable().optional(),
    staffCode: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    identityNumber: z.string().min(12).nullable().optional(),
    hireDate: z.coerce.date().nullable().optional(),
})

export type ProfileUpdateBody = z.infer<typeof ProfileUpdateBody>

export const ProfileResponse = z.object({
    user: ProfileUpdateBody,
})
export type ProfileResponse = z.infer<typeof ProfileResponse>

export const StaffRoleUpdateBody = z.object({
    role: AuthStaffProfileRole,
})
export type StaffRoleUpdateBody = z.infer<typeof StaffRoleUpdateBody>

export const StaffRoleResponse = z.object({
    user: z.object({
        id: AuthStaffProfileId,
        role: AuthStaffProfileRole,
    }),
})
export type StaffRoleResponse = z.infer<typeof StaffRoleResponse>
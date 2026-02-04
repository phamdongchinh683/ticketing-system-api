import z from 'zod'
import { AuthUserRole, AuthUserStatus } from '../database/auth/user/type.js'
import { AuthStaffProfileRole } from '../database/auth/staff_profile/type.js'
import { OrganizationBusCompanyId } from '../database/organization/bus_company/type.js'

export const Email = z.email()
export type Email = z.infer<typeof Email>

export const Phone = z.string().min(10)
export type Phone = z.infer<typeof Phone>

export const ContactInfo = z.object({
    email: Email,
    phone: Phone,
})
export type ContactInfo = z.infer<typeof ContactInfo>

export const UserInfo = z.object({
    fullName: z.string(),
    email: Email,
    phone: Phone,
    role: AuthUserRole,
    staffProfileRole: AuthStaffProfileRole.nullable(),
    companyId: OrganizationBusCompanyId.nullable().optional(),
    status: AuthUserStatus,
})

export type UserInfo = z.infer<typeof UserInfo>

export const OrderBy = z.enum(['asc', 'desc'])
export type OrderBy = z.infer<typeof OrderBy>

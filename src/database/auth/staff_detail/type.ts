import { z } from 'zod'

export const AuthStaffDetailId = z.coerce.number().brand<'auth.staff_detail.id'>()
export type AuthStaffDetailId = z.infer<typeof AuthStaffDetailId>

export const AuthUserRole = z.enum(['admin', 'driver', 'customer'])
export type AuthUserRole = z.infer<typeof AuthUserRole>

export const AuthUserStatus = z.enum(['active', 'inactive', 'banned'])
export type AuthUserStatus = z.infer<typeof AuthUserStatus>

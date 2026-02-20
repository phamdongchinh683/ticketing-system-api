import { AuthStaffProfileId } from '../../../database/auth/staff_profile/type.js'
import z from 'zod'
export const StaffIdParam = z.object({
    id: AuthStaffProfileId,
})

export type StaffIdParam = z.infer<typeof StaffIdParam>

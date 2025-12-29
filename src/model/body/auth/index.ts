import { z } from 'zod'
import { AuthUserId } from '../../../database/auth/type.js'

export const AuthBody = z.object({
    username: z.string().min(5),
    password: z.string().min(8),
})

export type AuthBody = z.infer<typeof AuthBody>

export const AuthResponse = z.object({
    id: AuthUserId,
})

export type AuthResponse = z.infer<typeof AuthResponse>

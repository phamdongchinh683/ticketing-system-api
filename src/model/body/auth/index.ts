import { z } from 'zod'
import { UserInfo } from '../../common.js'

export const AuthBody = z.object({
    username: z.string().min(5),
    password: z.string().min(8),
})

export type AuthBody = z.infer<typeof AuthBody>

export const AuthResponse = z.object({
    message: z.string(),
})

export type AuthResponse = z.infer<typeof AuthResponse>

export const AuthSignInResponse = z.object({
    message: z.string(),
    token: z.string(),
    user: UserInfo,
})

export type AuthSignInResponse = z.infer<typeof AuthSignInResponse>
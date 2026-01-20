import { z } from 'zod'
import { ContactInfo, Email, Phone, UserInfo } from '../../common.js'

const regPassword = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#@\\$%&!\\*\\?\\^_])(?!.*\\s).+$`
const message =
    'Password must contain uppercase, lowercase, a number, and one special character (# @ $ % & ! * ? ^ _), and no spaces'

export const AuthPassword = z.string().regex(new RegExp(regPassword), message).default('Abcd12345#')
export type AuthPassword = z.infer<typeof AuthPassword>

export const AuthBody = z.object({
    username: z.string().min(5),
    fullName: z.string().min(7),
    contactInfo: ContactInfo,
    password: AuthPassword,
})

export type AuthBody = z.infer<typeof AuthBody>

export const AuthResponse = z.object({
    message: z.string().optional(),
    token: z.string(),
    user: UserInfo,
})

export type AuthResponse = z.infer<typeof AuthResponse>

export const AuthSignInBody = z.object({
    username: z.string().min(5).optional(),
    phone: Phone.optional(),
    email: Email.optional(),
    password: z.string().min(8),
})

export type AuthSignInBody = z.infer<typeof AuthSignInBody>

import { z } from 'zod'

export const AuthBody = z.object({
    username: z.string().min(5),
    password: z.string().min(8),
})

export type AuthBody = z.infer<typeof AuthBody>

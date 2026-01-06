import { AuthUserId } from "../database/auth/type.js"
import z from "zod"

export const UserInfo = z.object({
    id: AuthUserId,
    username: z.string(),
})

export type UserInfo = z.infer<typeof UserInfo>
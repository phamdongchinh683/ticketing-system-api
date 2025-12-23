import z from 'zod'

export const BadRequestIssue = z.strictObject({
    field: z.string(),
    kind: z.string(),
    reason: z.string().optional(),
})
export const BadRequest = z.strictObject({
    issues: BadRequestIssue.array(),
    location: z.string().optional(),
})

export type BadRequest = z.infer<typeof BadRequest>
export type BadRequestIssue = z.infer<typeof BadRequestIssue>


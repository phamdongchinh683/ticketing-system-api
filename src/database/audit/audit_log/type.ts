import { z } from 'zod'

export const AuditLogId = z.coerce.number().brand<'audit.audit_log.id'>()
export type AuditLogId = z.infer<typeof AuditLogId>

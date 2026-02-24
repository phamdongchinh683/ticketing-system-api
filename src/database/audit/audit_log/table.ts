import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { AuditLogId } from './type.js'
import { AuthUserId } from '../../auth/user/type.js'

export interface AuditLogTable extends Timestamps {
    id: GeneratedAlways<AuditLogId>
    userId: AuthUserId
    action: string
    targetType: string
    targetId: string
    oldData: JSON
    newData: JSON
}

export type AuditLogTableInsert = Insertable<AuditLogTable>
export type AuditLogTableSelect = Selectable<AuditLogTable>
export type AuditLogTableUpdate = Updateable<AuditLogTable>

import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { AuthStaffProfileId, AuthStaffProfileRole } from './type.js'
import { AuthUserId } from '../user/type.js'

export interface AuthStaffProfileTable extends Timestamps {
    id: GeneratedAlways<AuthStaffProfileId>
    userId: AuthUserId
    role: AuthStaffProfileRole
}

export type AuthStaffProfileTableInsert = Insertable<AuthStaffProfileTable>
export type AuthStaffProfileTableSelect = Selectable<AuthStaffProfileTable>
export type AuthStaffProfileTableUpdate = Updateable<AuthStaffProfileTable>

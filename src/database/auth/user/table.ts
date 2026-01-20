import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { AuthUserId, AuthUserRole, AuthUserStatus } from './type.js'

export interface AuthUserTable extends Timestamps {
    id: GeneratedAlways<AuthUserId>
    username: string
    password: string
    fullName: string
    email: string
    phone: string
    role: AuthUserRole
    status: AuthUserStatus
}

export type AuthUserTableInsert = Insertable<AuthUserTable>
export type AuthUserTableSelect = Selectable<AuthUserTable>
export type AuthUserTableUpdate = Updateable<AuthUserTable>

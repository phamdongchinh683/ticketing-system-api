import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { AuthStaffDetailId, AuthUserStatus } from './type.js'
import { AuthUserId } from '../user/type.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'

export interface AuthStaffDetailTable extends Timestamps {
    id: GeneratedAlways<AuthStaffDetailId>
    userId: AuthUserId
    companyId: OrganizationBusCompanyId | null
    staffCode: string | null
    position: string | null
    department: string | null
    phone: string
    email: string
    identityNumber: string | null
    hireDate: Date | null
    status: AuthUserStatus
}

export type AuthStaffDetailTableInsert = Insertable<AuthStaffDetailTable>
export type AuthStaffDetailTableSelect = Selectable<AuthStaffDetailTable>
export type AuthStaffDetailTableUpdate = Updateable<AuthStaffDetailTable>

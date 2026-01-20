import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Timestamps } from '../../../datasource/helpers/common.js'
import { AuthUserId, AuthUserStatus } from './type.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'

export interface AuthStaffDetailTable extends Timestamps {
    id: GeneratedAlways<AuthUserId>
    userId: AuthUserId
    companyId: OrganizationBusCompanyId
    staffCode: string
    position: string
    department: string
    phone: string
    email: string
    identityNumber: string
    hireDate: Date
    status: AuthUserStatus
}

export type AuthStaffDetailTableInsert = Insertable<AuthStaffDetailTable>
export type AuthStaffDetailTableSelect = Selectable<AuthStaffDetailTable>
export type AuthStaffDetailTableUpdate = Updateable<AuthStaffDetailTable>

import { CompanyAdminQuery } from '../../../model/query/company-admin/index.js'
import { StaffRoleQuery } from '../../../model/query/staff/index.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'
import { AuthStaffProfileRole } from '../staff_profile/type.js'
import { db } from '../../../datasource/db.js'

export async function findAll(query: StaffRoleQuery, companyId: OrganizationBusCompanyId) {
    const { position, department, status, code, email, phone, identityNumber, limit, next } = query
    return await db
        .selectFrom('auth.staff_detail as a')
        .innerJoin('auth.user', 'a.userId', 'auth.user.id')
        .select([
            'a.id',
            'auth.user.id as userId',
            'a.staffCode',
            'a.position',
            'a.department',
            'a.phone',
            'a.email',
            'a.identityNumber',
            'a.hireDate',
            'auth.user.fullName',
        ])
        .where(eb => {
            const cond = []
            cond.push(eb('a.companyId', '=', companyId))
            if (position) {
                cond.push(eb('a.position', '=', position))
            }
            if (department) {
                cond.push(eb('a.department', '=', department))
            }
            if (status) {
                cond.push(eb('a.status', '=', status))
            }
            if (code) {
                cond.push(eb('a.staffCode', '=', code))
            }
            if (email) {
                cond.push(eb('a.email', '=', email))
            }
            if (phone) {
                cond.push(eb('a.phone', '=', phone))
            }
            if (identityNumber) {
                cond.push(eb('a.identityNumber', '=', identityNumber))
            }
            if (next) {
                cond.push(eb('a.id', '>', next))
            }
            return eb.and(cond)
        })
        .limit(limit + 1)
        .orderBy('id', 'asc')
        .execute()
}

export async function findAllCompanyAdmins(query: CompanyAdminQuery) {
    const { limit, next } = query
    return db
        .selectFrom('auth.user as u')
        .innerJoin('auth.staff_profile as sp', 'sp.userId', 'u.id')
        .innerJoin('auth.staff_detail as sd', 'sd.userId', 'u.id')
        .leftJoin('organization.bus_company as bc', 'bc.id', 'sd.companyId')
        .where(eb => {
            const cond = []
            cond.push(eb('sp.role', '=', AuthStaffProfileRole.enum.company_admin))
            if (next) cond.push(eb('u.id', '>', next))
            return eb.and(cond)
        })
        .select([
            'u.id',
            'u.username',
            'u.fullName',
            'u.email',
            'u.phone',
            'u.status',
            'sp.role',
            'sd.companyId',
            'bc.name as companyName',
        ])
        .limit(limit + 1)
        .orderBy('u.id', 'asc')
        .execute()
}

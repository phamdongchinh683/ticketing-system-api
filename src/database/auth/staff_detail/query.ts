import { StaffRoleQuery } from '../../../model/query/staff/index.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'
import { db } from '../../../datasource/db.js'

export async function findAll(query: StaffRoleQuery, companyId: OrganizationBusCompanyId) {
    const {
        position,
        department,
        status,
        code,
        email,
        phone,
        identityNumber,
        limit,
        next,
    } = query
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

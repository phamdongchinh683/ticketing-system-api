import { dal } from '../../database/index.js'
import { CompanyAdminListQuery } from '../../model/query/company-admin/index.js'
import {
    CompanyAdminCreateBody,
    CompanyAdminUpdateBody,
} from '../../model/body/company-admin/index.js'
import { AuthUserId, AuthUserStatus } from '../../database/auth/user/type.js'
import { AuthStaffProfileRole } from '../../database/auth/staff_profile/type.js'
import { utils } from '../../utils/index.js'
import { HttpErr } from '../../app/index.js'

export async function getDashboard() {
    const [totalUsers, totalBookings, totalRevenue] = await Promise.all([
        dal.auth.user.query.countAll(),
        dal.booking.booking.query.countAll(),
        dal.payment.payment.query.getTotalRevenue(),
    ])
    return {
        overview: {
            totalUsers,
            totalBookings,
            totalRevenue,
        },
    }
}

export async function listCompanyAdmins(query: CompanyAdminListQuery) {
    const result = await dal.auth.staffDetail.query.findAllCompanyAdmins(query)
    const { data, next } = utils.common.paginateByCursor(result, query.limit)
    return {
        admins: data,
        next,
    }
}

export async function createCompanyAdmin(body: CompanyAdminCreateBody) {
    return dal.auth.user.cmd.signUpCompanyAdminWithCompany(
        body,
        AuthStaffProfileRole.enum.company_admin,
        body.companyId
    )
}
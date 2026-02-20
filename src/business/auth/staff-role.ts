import { AuthStaffProfileTableUpdate } from '../../database/auth/staff_profile/table.js'
import { AuthStaffProfileId } from '../../database/auth/staff_profile/type.js'
import { dal } from '../../database/index.js'
import { OrganizationBusCompanyId } from '../../database/organization/bus_company/type.js'
import { StaffRoleQuery } from '../../model/query/staff/index.js'
import { utils } from '../../utils/index.js'
import { AuthUserId } from '../../database/auth/user/type.js'

export async function getStaffRole(query: StaffRoleQuery, companyId: OrganizationBusCompanyId) {
    const result = await dal.auth.staffDetail.query.findAll(query, companyId)
    const { data, next } = utils.common.paginateByCursor(result, query.limit)

    return {
        staff: data,
        next: next,
    }
}

export async function updateStaffRole(id: AuthUserId, body: AuthStaffProfileTableUpdate) {
    return {
        user: await dal.auth.staffProfile.query.updateOne(id, body),
    }
}

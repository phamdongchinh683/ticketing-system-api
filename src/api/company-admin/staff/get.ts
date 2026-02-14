import { api, endpoint, tags, bearer } from '../../../app/api.js'
import { bus } from '../../../business/index.js'
import { requireRoles } from '../../../app/jwt/handler.js'
import { AuthUserRole } from '../../../database/auth/user/type.js'
import { StaffRoleQuery } from '../../../model/query/staff/index.js'
import { StaffListResponse } from '../../../model/body/staff/index.js'

const __filename = new URL('', import.meta.url).pathname

api.route({
    ...endpoint(__filename),
    config: {
        rateLimit: {
            max: 10,
            timeWindow: '1m',
        },
    },
    handler: async request => {
        const userInfo = requireRoles(request.headers, [AuthUserRole.enum.admin])
        return await bus.auth.staffRole.getStaffRole(request.query, userInfo.companyId)
    },

    schema: {
        querystring: StaffRoleQuery,
        response: { 200: StaffListResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

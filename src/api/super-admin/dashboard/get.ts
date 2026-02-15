import { api, endpoint, tags, bearer } from '../../../app/api.js'
import { bus } from '../../../business/index.js'
import { requireRoles, requireStaffProfileRole } from '../../../app/jwt/handler.js'
import { AuthUserRole } from '../../../database/auth/user/type.js'
import { DashboardResponseSchema } from '../../../model/body/dashboard/index.js'
import { AuthStaffProfileRole } from '../../../database/auth/staff_profile/type.js'

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
        requireStaffProfileRole(
            request.headers,
            [AuthUserRole.enum.admin],
            [AuthStaffProfileRole.enum.super_admin]
        )
        return await bus.auth.superAdmin.getDashboard()
    },

    schema: {
        response: { 200: DashboardResponseSchema },
        tags: tags(__filename),
        security: bearer,
    },
})

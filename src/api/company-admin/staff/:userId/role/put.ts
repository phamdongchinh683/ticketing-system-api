import { api, endpoint, tags, bearer } from '../../../../../app/api.js'
import { bus } from '../../../../../business/index.js'
import { requireRoles } from '../../../../../app/jwt/handler.js'
import { AuthUserRole } from '../../../../../database/auth/user/type.js'
import { StaffRoleResponse, StaffRoleUpdateBody } from '../../../../../model/body/profile/index.js'
import { UserIdParam } from '../../../../../model/params/user/index.js'

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
        return await bus.auth.staffRole.updateStaffRole(request.params.userId, request.body)
    },

    schema: {
        params: UserIdParam,
        body: StaffRoleUpdateBody,
        response: { 200: StaffRoleResponse },
        tags: tags(__filename),
        security: bearer,
    },
})

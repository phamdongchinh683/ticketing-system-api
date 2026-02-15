import { AuthUserRole, AuthUserStatus } from '../../database/auth/user/type.js'
import { dal } from '../../database/index.js'
import { AuthBody } from '../../model/body/auth/index.js'
import { utils } from '../../utils/index.js'
import { DriverQuery } from '../../model/query/driver/index.js'

export async function register(body: AuthBody, role: AuthUserRole) {
    const data = {
        username: body.username,
        fullName: body.fullName,
        ...utils.common.parseContactInfo(body.contactInfo),
        password: utils.password.hashPassword(body.password),
        role,
        status: AuthUserStatus.enum.active,
    }

    return dal.auth.user.cmd.signUp(data)
}

export async function getDrivers(query: DriverQuery) {
    const drivers = await dal.auth.user.query.findAllDrivers(query)
    const { data, next } = utils.common.paginateByCursor(drivers, query.limit)
    return {
        drivers: data,
        next: next,
    }
}

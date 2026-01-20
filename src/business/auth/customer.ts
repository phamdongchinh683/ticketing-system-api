import { AuthUserRole, AuthUserStatus } from '../../database/auth/user/type.js'
import { dal } from '../../database/index.js'
import { AuthBody, AuthSignInBody } from '../../model/body/auth/index.js'
import { ContactInfo } from '../../model/common.js'
import { utils } from '../../utils/index.js'

export async function register(body: AuthBody, role: AuthUserRole) {
    const data = {
        username: body.username,
        fullName: body.fullName,
        ...parseContactInfo(body.contactInfo),
        password: utils.password.hashPassword(body.password),
        role,
        status: AuthUserStatus.enum.active,
    }

    return dal.auth.user.cmd.signUp(data)
}

function parseContactInfo(contactInfo: ContactInfo) {
    return {
        email: contactInfo.email,
        phone: contactInfo.phone,
    }
}

import { dal } from '../../database/index.js'
import { AuthBody } from '../../model/body/auth/index.js'
import { utils } from '../../utils/index.js'

export async function register(body: AuthBody) {
    const hashedPassword = utils.password.hashPassword(body.password)

    return dal.auth.cmd._createOne({
        ...body,
        password: hashedPassword,
    })
}

export async function signIn(body: AuthBody) {
    return {
        message: 'OK',
    }
}

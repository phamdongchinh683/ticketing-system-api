import { HttpErr } from '../../app/index.js'
import { generateToken } from '../../app/jwt/handler.js'
import { dal } from '../../database/index.js'
import { AuthSignInBody } from '../../model/body/auth/index.js'
import { utils } from '../../utils/index.js'

export async function byUsernameEmailOrPhone(params: AuthSignInBody) {
    const user = await dal.auth.user.query.getOne({
        username: params.username,
        email: params.email,
        phone: params.phone,
    })
    if (!user) {
        throw new HttpErr.NotFound(
            'User not found with the provided username, email or phone.',
            {
                username: params.username,
                email: params.email,
                phone: params.phone,
            },
            'USER_NOT_FOUND',
            404
        )
    }

    const isValid = utils.password.verifyPassword(params.password, user.password)
    if (!isValid) {
        throw new HttpErr.Unauthorized('Incorrect password.')
    }

    return {
        message: 'OK',
        token: generateToken(user),
        user,
    }
}

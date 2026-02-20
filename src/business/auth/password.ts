import { dal } from '../../database/index.js'
import { AuthUserId } from '../../database/auth/user/type.js'
import { HttpErr } from '../../app/index.js'
import { utils } from '../../utils/index.js'
import { AuthPassword } from '../../model/body/auth/index.js'

export async function updatePassword(
    id: AuthUserId,
    params: {
        oldPassword: AuthPassword
        newPassword: AuthPassword
    }
) {
    const user = await dal.auth.user.query.getOne({ id })
    if (!user) {
        throw new HttpErr.NotFound('USER_NOT_FOUND')
    }

    const verify = utils.password.verifyPassword(params.oldPassword, user.password)

    if (!verify) {
        throw new HttpErr.Unauthorized('Incorrect password.')
    }

    await dal.auth.user.cmd.updatePassword(id, params.newPassword)

    return {
        message: 'OK',
    }
}

import { HttpErr } from '../../app/index.js'
import { generateToken } from '../../app/jwt/handler.js'
import { dal } from '../../database/index.js'
import { AuthBody } from '../../model/body/auth/index.js'
import { UserInfo } from '../../model/common.js'
import { utils } from '../../utils/index.js'

export async function register(body: AuthBody) {
    const hashedPassword = utils.password.hashPassword(body.password)

    return dal.auth.cmd._createOne({
        ...body,
        password: hashedPassword,
    })
}

export async function signIn(body: AuthBody) {
   const user = await dal.auth.cmd._findOneByUsername(body.username)

   if (!user) {
    throw new HttpErr.NotFound('User not found')
   }

   const isPasswordValid = utils.password.verifyPassword(body.password, user.password)

   if (!isPasswordValid) {
    throw new HttpErr.Unauthorized("Invalid password")
   }

   return {
    message: 'OK',
    token: generateToken(user),
    user: UserInfo.parse(user),
   }
}

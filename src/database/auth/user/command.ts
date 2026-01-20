import { AuthUserTableInsert } from './table.js'
import { dal } from '../../index.js'
import { HttpErr } from '../../../app/index.js'
import { DatabaseError } from 'pg'
import { generateToken } from '../../../app/jwt/handler.js'

export async function signUp(params: AuthUserTableInsert) {
    try {
        const user = await dal.auth.user.query.insertOne(params)

        return {
            message: 'OK',
            token: generateToken(user),
            user: user,
        }
    } catch (error) {
        if (error instanceof DatabaseError && error.code === '23505') {
            if (error.constraint === 'user_username_key')
                throw new HttpErr.UnprocessableEntity(
                    `${params.username} has been registered before`,
                    'USERNAME_ALREADY_EXISTS'
                )
            if (error.constraint === 'user_email_key')
                throw new HttpErr.UnprocessableEntity(
                    `${params.email} has been registered before`,
                    'EMAIL_ALREADY_EXISTS'
                )
            if (error.constraint === 'user_phone_key')
                throw new HttpErr.UnprocessableEntity(
                    `${params.phone} has been registered before`,
                    'PHONE_ALREADY_EXISTS'
                )
        }
        throw error
    }
}

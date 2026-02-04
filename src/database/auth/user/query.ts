import { db } from '../../../datasource/db.js'
import { AuthUserTableInsert } from './table.js'

export async function insertOne(params: AuthUserTableInsert) {
    return db.insertInto('auth.user').values(params).returningAll().executeTakeFirstOrThrow()
}

export function getOne(params: { username?: string; email?: string; phone?: string }) {
    const { username, email, phone } = params
    return db
        .selectFrom('auth.user')
        .leftJoin('auth.staff_profile', 'auth.user.id', 'auth.staff_profile.userId')
        .select([
            'auth.user.username',
            'auth.user.fullName',
            'auth.user.password',
            'auth.user.email',
            'auth.user.phone',
            'auth.user.role',
            'auth.user.status',
            'auth.staff_profile.role as staffProfileRole',
        ])
        .where(eb => {
            const cond = []
            if (username) cond.push(eb('username', '=', username))
            if (email) cond.push(eb('email', '=', email))
            if (phone) cond.push(eb('phone', '=', phone))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

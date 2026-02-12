import { db } from '../../../datasource/db.js'
import { AuthUserTableInsert } from './table.js'

export async function insertOne(params: AuthUserTableInsert) {
    return db.insertInto('auth.user').values(params).returningAll().executeTakeFirstOrThrow()
}

export function getOne(params: { username?: string; email?: string; phone?: string }) {
    const { username, email, phone } = params
    return db
        .selectFrom('auth.user as u')
        .leftJoin('auth.staff_profile', 'u.id', 'auth.staff_profile.userId')
        .leftJoin('auth.staff_detail', 'u.id', 'auth.staff_detail.userId')
        .select([
            'u.id',
            'u.username',
            'u.fullName',
            'u.password',
            'u.email',
            'u.phone',
            'u.role',
            'u.status',
            'auth.staff_detail.companyId',
            'auth.staff_profile.role as staffProfileRole',
        ])
        .where(eb => {
            const cond = []
            if (username) cond.push(eb('u.username', '=', username))
            if (email) cond.push(eb('u.email', '=', email))
            if (phone) cond.push(eb('u.phone', '=', phone))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

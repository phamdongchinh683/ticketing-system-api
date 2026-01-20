import { db } from '../../../datasource/db.js'
import { dal } from '../../index.js'
import { AuthUserTableInsert } from './table.js'

export async function insertOne(params: AuthUserTableInsert) {
    return db.insertInto('auth.user').values(params).returningAll().executeTakeFirstOrThrow()
}

export function getOne(params: { username?: string; email?: string; phone?: string }) {
    const { username, email, phone } = params
    return db
        .selectFrom('auth.user')
        .selectAll()
        .where(eb => {
            const cond = []
            if (username) cond.push(eb('username', '=', username))
            if (email) cond.push(eb('email', '=', email))
            if (phone) cond.push(eb('phone', '=', phone))
            return eb.and(cond)
        })
        .executeTakeFirst()
}

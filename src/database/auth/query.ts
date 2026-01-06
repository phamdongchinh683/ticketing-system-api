import { db } from '../../datasource/db.js'
import { AuthUserTableInsert } from './table.js'

export async function insertOne(params: AuthUserTableInsert) {
    return db.insertInto('auth.user').values(params).returningAll().executeTakeFirstOrThrow()
}

export async function findOneByUsername(username: string) {
    return db.selectFrom('auth.user').where("username", '=', username).selectAll().executeTakeFirstOrThrow()
}
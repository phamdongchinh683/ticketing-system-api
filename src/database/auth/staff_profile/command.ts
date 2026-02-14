import { AuthStaffProfileTableInsert } from './table.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { db } from '../../../datasource/db.js'

export async function upsertOne(params: AuthStaffProfileTableInsert, trx?: Transaction<Database>) {
    return (trx ?? db)
        .insertInto('auth.staff_profile')
        .values(params)
        .onConflict(oc => oc.column('userId').doUpdateSet(params))
        .returningAll()
        .executeTakeFirstOrThrow()
}
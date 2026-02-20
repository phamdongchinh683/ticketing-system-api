import { db } from '../../../datasource/db.js'
import { AuthStaffDetailTableInsert, AuthStaffDetailTableUpdate } from './table.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'
import { AuthUserId } from '../user/type.js'

export async function upsertOne(params: AuthStaffDetailTableInsert, trx?: Transaction<Database>) {
    const data = _.omitBy(params, v => _.isNil(v)) as AuthStaffDetailTableInsert

    return (trx ?? db)
        .insertInto('auth.staff_detail')
        .values(data)
        .onConflict(oc => oc.column('userId').doUpdateSet(params))
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function updateOne(
    userId: AuthUserId,
    params: AuthStaffDetailTableUpdate,
    trx?: Transaction<Database>
) {
    const data = _.omitBy(params, v => _.isNil(v)) as AuthStaffDetailTableUpdate
    return (trx ?? db)
        .updateTable('auth.staff_detail')
        .set(data)
        .where('userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow()
}

export async function getOne(userId: AuthUserId, trx?: Transaction<Database>) {
    return (trx ?? db)
        .selectFrom('auth.staff_detail')
        .selectAll()
        .where('userId', '=', userId)
        .executeTakeFirst()
}

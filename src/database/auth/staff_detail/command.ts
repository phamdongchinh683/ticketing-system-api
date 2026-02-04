import { db } from '../../../datasource/db.js'
import { AuthStaffDetailTableInsert } from './table.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import _ from 'lodash'

export async function upsertOne(params: AuthStaffDetailTableInsert, trx?: Transaction<Database>) {
    const data = _.omitBy(params, v => _.isNil(v)) as AuthStaffDetailTableInsert

    return (trx ?? db)
        .insertInto('auth.staff_detail')
        .values(data)
        .onConflict(oc => oc.column('userId').doUpdateSet(params))
        .returningAll()
        .executeTakeFirstOrThrow()
}

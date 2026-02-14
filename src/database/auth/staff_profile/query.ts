import { db } from '../../../datasource/db.js'
import { AuthStaffProfileTableSelect, AuthStaffProfileTableUpdate } from './table.js'
import { AuthStaffProfileId } from './type.js'
import { AuthUserId } from '../user/type.js'

export async function getOne(params: AuthStaffProfileTableSelect) {
    return await db
        .selectFrom('auth.staff_profile')
        .selectAll()
        .where('userId', '=', params.userId)
        .executeTakeFirst()
}

export async function updateOne(userId: AuthUserId, params: AuthStaffProfileTableUpdate) {
    return db
        .updateTable('auth.staff_profile')
        .set(params)
        .where('userId', '=', userId)
        .returning(['id', 'role'])
        .executeTakeFirstOrThrow()
}

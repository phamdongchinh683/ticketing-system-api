import { db } from '../../datasource/db.js'
import { dal } from '../index.js'
import { AuthUserTableInsert } from './table.js'

export function _createOne(params: AuthUserTableInsert) {
    return dal.auth.query.insertOne(params)
}

import { AuthUserTable } from '../database/auth/table.js'

export interface Database {
    'auth.user': AuthUserTable
}

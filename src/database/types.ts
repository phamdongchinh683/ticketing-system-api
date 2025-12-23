import type { Database as KyselyDatabase } from 'kysely'
import type { AuthTable } from './auth/table.js'

// Main database type definition
export interface Database extends KyselyDatabase {
    auth: AuthTable
}


import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const schema = 'market'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS ${schema};
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS ${schema};
`
export async function up(db: Kysely<any>): Promise<void> {
	await UP.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	await DOWN.execute(db)
}

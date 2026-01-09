import type { Kysely } from 'kysely'
import { sql } from 'kysely'


const UP = sql`
	CREATE SCHEMA IF NOT EXISTS market;
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS market;
`
export async function up(db: Kysely<any>): Promise<void> {
	await UP.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	await DOWN.execute(db)
}

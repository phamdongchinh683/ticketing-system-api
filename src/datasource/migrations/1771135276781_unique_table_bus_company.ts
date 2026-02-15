import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
		ALTER TABLE organization.bus_company ADD CONSTRAINT bus_company_name_hotline UNIQUE (name, hotline);
	`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	await sql`
		ALTER TABLE organization.bus_company DROP CONSTRAINT IF EXISTS bus_company_name_hotline;
	`.execute(db)
}

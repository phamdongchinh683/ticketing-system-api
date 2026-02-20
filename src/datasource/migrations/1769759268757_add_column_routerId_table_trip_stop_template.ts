import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			ADD COLUMN IF NOT EXISTS route_id INT REFERENCES operation.route (id),
			ADD COLUMN IF NOT EXISTS company_id INT REFERENCES organization.bus_company (id);
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			DROP COLUMN IF EXISTS company_id,
			DROP COLUMN IF EXISTS route_id;
	`.execute(db)
}

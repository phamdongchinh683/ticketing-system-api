import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			ADD COLUMN IF NOT EXISTS arrival_time TIMESTAMP,
			ADD COLUMN IF NOT EXISTS departure_time TIMESTAMP;
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			DROP COLUMN IF EXISTS departure_time,
			DROP COLUMN IF EXISTS arrival_time;
	`.execute(db)
}

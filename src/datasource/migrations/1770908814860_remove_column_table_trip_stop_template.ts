import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			DROP COLUMN IF EXISTS arrival_offset_min,
			DROP COLUMN IF EXISTS departure_offset_min,
			DROP COLUMN IF EXISTS arrival_time,
			DROP COLUMN IF EXISTS departure_time;
		ALTER TABLE booking.ticket 
			drop column if exists price;
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			ADD COLUMN IF NOT EXISTS arrival_offset_min INT,
			ADD COLUMN IF NOT EXISTS departure_offset_min INT,
			ADD COLUMN IF NOT EXISTS arrival_time TIMESTAMP,
			ADD COLUMN IF NOT EXISTS departure_time TIMESTAMP;
		ALTER TABLE booking.ticket 
			ADD COLUMN IF NOT EXISTS price DECIMAL;
	`.execute(db)
}

import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			RENAME COLUMN arrival_time TO arrival_offset_min;

		ALTER TABLE operation.trip_stop_template
			RENAME COLUMN departure_time TO departure_offset_min;

		ALTER TABLE operation.trip_stop_template
			ALTER COLUMN arrival_offset_min TYPE INT
				USING FLOOR(EXTRACT(EPOCH FROM arrival_offset_min::TIME) / 60),
			ALTER COLUMN departure_offset_min TYPE INT
				USING FLOOR(EXTRACT(EPOCH FROM departure_offset_min::TIME) / 60);
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_stop_template
			ALTER COLUMN arrival_offset_min TYPE TIMESTAMP
				USING (CURRENT_DATE + make_interval(mins => arrival_offset_min))::TIMESTAMP,
			ALTER COLUMN departure_offset_min TYPE TIMESTAMP
				USING (CURRENT_DATE + make_interval(mins => departure_offset_min))::TIMESTAMP;

		ALTER TABLE operation.trip_stop_template
			RENAME COLUMN arrival_offset_min TO arrival_time;

		ALTER TABLE operation.trip_stop_template
			RENAME COLUMN departure_offset_min TO departure_time;
	`.execute(db)
}

import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_price_template
			ALTER COLUMN id TYPE INT;

		CREATE SEQUENCE IF NOT EXISTS operation.trip_price_template_id_seq;

		ALTER TABLE operation.trip_price_template
			ALTER COLUMN id SET DEFAULT nextval('operation.trip_price_template_id_seq');

	ALTER TABLE operation.trip_price_template
		ADD CONSTRAINT trip_price_template_unique_route_station
		UNIQUE (company_id, route_id, from_station_id, to_station_id);

		SELECT setval(
			'operation.trip_price_template_id_seq',
			COALESCE((SELECT MAX(id) FROM operation.trip_price_template), 0) + 1,
			false
		);

	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE operation.trip_price_template
			ALTER COLUMN id DROP DEFAULT;

	ALTER TABLE operation.trip_price_template
		DROP CONSTRAINT IF EXISTS trip_price_template_unique_route_station;

		DROP SEQUENCE IF EXISTS operation.trip_price_template_id_seq;
	`.execute(db)
}

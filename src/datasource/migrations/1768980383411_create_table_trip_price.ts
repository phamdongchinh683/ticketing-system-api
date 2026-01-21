import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE TABLE operation.trip_price (
		id SERIAL PRIMARY KEY,
		trip_id INT REFERENCES operation.trip (id),
		from_station_id INT REFERENCES operation.station (id),
		to_station_id INT REFERENCES operation.station (id),
		price DECIMAL(12, 2),
		currency VARCHAR(10) DEFAULT 'VND',
		is_active BOOLEAN,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);

	CREATE INDEX trip_price_trip_id_idx ON operation.trip_price (trip_id);
	CREATE UNIQUE INDEX trip_price_trip_route_idx ON operation.trip_price (trip_id, from_station_id, to_station_id);
	CREATE INDEX trip_price_is_active_idx ON operation.trip_price (is_active);
`

const DOWN = sql`
	DROP TABLE IF EXISTS operation.trip_price;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

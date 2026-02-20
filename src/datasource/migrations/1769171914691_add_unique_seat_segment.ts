import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	ALTER TABLE booking.seat_segment
		ADD CONSTRAINT seat_segment_unique_trip_seat_station
		UNIQUE (trip_id, seat_id, from_station_id, to_station_id);
`

const DOWN = sql`
	ALTER TABLE booking.seat_segment
		DROP CONSTRAINT IF EXISTS seat_segment_unique_trip_seat_station;
`

export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

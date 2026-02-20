import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE INDEX idx_seat_segments_conflict
	ON booking.seat_segment (trip_id, seat_id, from_station_id, to_station_id);
`

const DOWN = sql`
	DROP INDEX IF EXISTS booking.idx_seat_segments_conflict;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

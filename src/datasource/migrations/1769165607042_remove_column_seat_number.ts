import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	ALTER TABLE booking.ticket
		DROP COLUMN IF EXISTS seat_number;
`

const DOWN = sql`
	ALTER TABLE booking.ticket
		ADD COLUMN seat_number VARCHAR(10);
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

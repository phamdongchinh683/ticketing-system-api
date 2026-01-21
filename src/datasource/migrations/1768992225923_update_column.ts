import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	ALTER TABLE operation.station
		RENAME COLUMN name TO address;

	DROP INDEX IF EXISTS operation.station_name_idx;
	CREATE INDEX station_address_idx ON operation.station (address);
`

const DOWN = sql`
	DROP INDEX IF EXISTS station_address_idx;
	ALTER TABLE operation.station
		RENAME COLUMN address TO name;
	CREATE INDEX station_name_idx ON operation.station (name);
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

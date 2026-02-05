import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    const up = sql`
		ALTER TABLE operation.trip_schedule
			ADD CONSTRAINT trip_schedule_unique_company_route
			UNIQUE (company_id, route_id);
	`

    await up.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    const down = sql`
		ALTER TABLE operation.trip_schedule
			DROP CONSTRAINT IF EXISTS trip_schedule_unique_company_route;
	`

    await down.execute(db)
}

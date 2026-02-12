import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`

	DROP TABLE  IF EXISTS operation.trip_stop;
	DROP TABLE  IF EXISTS operation.trip_price;

		ALTER TABLE auth.user
			DROP COLUMN IF EXISTS update_at;

		ALTER TABLE booking.coupon
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE booking.booking
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE booking.ticket
			DROP COLUMN IF EXISTS update_at;

		ALTER TABLE operation.route
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE operation.station
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE operation.trip
			DROP COLUMN IF EXISTS update_at;

		ALTER TABLE organization.bus_company
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE organization.vehicle
			DROP COLUMN IF EXISTS update_at;
		ALTER TABLE organization.seat
			DROP COLUMN IF EXISTS update_at;

		ALTER TABLE payment.payment
			DROP COLUMN IF EXISTS update_at;
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`


		ALTER TABLE auth.user
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;

		ALTER TABLE booking.coupon
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE booking.booking
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE booking.ticket
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;

		ALTER TABLE operation.route
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE operation.station
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE operation.trip
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE operation.trip_stop
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE organization.bus_company
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE organization.vehicle
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
		ALTER TABLE organization.seat
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;

		ALTER TABLE payment.payment
			ADD COLUMN IF NOT EXISTS update_at TIMESTAMP;
	`.execute(db)
}

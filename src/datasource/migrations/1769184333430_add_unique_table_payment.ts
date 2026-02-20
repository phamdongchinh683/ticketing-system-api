import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	DO $$
	BEGIN
		IF NOT EXISTS (
			SELECT 1
			FROM pg_constraint c
			JOIN pg_class t ON c.conrelid = t.oid
			JOIN pg_namespace n ON n.oid = t.relnamespace
			WHERE n.nspname = 'payment'
				AND t.relname = 'payment'
				AND c.conname = 'payment_booking_id_key'
		) THEN
			ALTER TABLE payment.payment
				ADD CONSTRAINT payment_booking_id_key UNIQUE (booking_id);
		END IF;
	END $$;
`

const DOWN = sql`
	ALTER TABLE payment.payment
		DROP CONSTRAINT IF EXISTS payment_booking_id_key;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

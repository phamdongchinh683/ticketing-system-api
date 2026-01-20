import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS payment;

	CREATE TYPE payment.payment_method AS ENUM ('zalopay', 'vnpay', 'momo', 'cash');
	CREATE TYPE payment.payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

	CREATE TABLE payment.payment (
		id SERIAL PRIMARY KEY,
		booking_id INT REFERENCES booking.booking (id),
		amount DECIMAL,
		method payment.payment_method,
		status payment.payment_status,
		transaction_code VARCHAR(100),
		paid_at TIMESTAMP,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX payment_booking_id_idx ON payment.payment (booking_id);
	CREATE INDEX payment_transaction_code_idx ON payment.payment (transaction_code);
	CREATE INDEX payment_status_idx ON payment.payment (status);

	CREATE TABLE payment.refund (
		id SERIAL PRIMARY KEY,
		payment_id INT REFERENCES payment.payment (id),
		amount DECIMAL,
		reason TEXT,
		refunded_by INT REFERENCES auth.user (id),
		refunded_at TIMESTAMP
	);

	CREATE INDEX refund_payment_id_idx ON payment.refund (payment_id);
	CREATE INDEX refund_refunded_by_idx ON payment.refund (refunded_by);
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS payment CASCADE;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

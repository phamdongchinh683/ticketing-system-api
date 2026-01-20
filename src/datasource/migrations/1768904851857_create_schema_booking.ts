import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS booking;

	CREATE TYPE booking.booking_type AS ENUM ('one_way', 'round_trip');
	CREATE TYPE booking.booking_status AS ENUM ('pending', 'paid', 'cancelled', 'expired');
	CREATE TYPE booking.ticket_status AS ENUM ('reserved', 'paid', 'cancelled', 'checked_in');
	CREATE TYPE booking.discount_type AS ENUM ('percent', 'fixed');

	CREATE TABLE booking.coupon (
		id SERIAL PRIMARY KEY,
		code VARCHAR(50) NOT NULL UNIQUE,
		discount_type booking.discount_type,
		discount_value DECIMAL,
		min_order_amount DECIMAL,
		max_discount_amount DECIMAL,
		total_quantity INT,
		used_quantity INT,
		start_date TIMESTAMP,
		end_date TIMESTAMP,
		is_active BOOLEAN,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX coupon_is_active_idx ON booking.coupon (is_active);

	CREATE TABLE booking.booking (
		id SERIAL PRIMARY KEY,
		user_id INT REFERENCES auth.user (id),
		coupon_id INT REFERENCES booking.coupon (id),
		code VARCHAR(20) UNIQUE,
		booking_type booking.booking_type,
		original_amount DECIMAL,
		discount_amount DECIMAL,
		total_amount DECIMAL,
		status booking.booking_status,
		expired_at TIMESTAMP,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX booking_user_id_idx ON booking.booking (user_id);
	CREATE INDEX booking_status_idx ON booking.booking (status);

	CREATE TABLE booking.ticket (
		id SERIAL PRIMARY KEY,
		booking_id INT REFERENCES booking.booking (id),
		trip_id INT REFERENCES operation.trip (id),
		seat_id INT REFERENCES organization.seat (id),
		from_station_id INT REFERENCES operation.station (id),
		to_station_id INT REFERENCES operation.station (id),
		seat_number VARCHAR(10),
		price DECIMAL,
		status booking.ticket_status,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX ticket_booking_id_idx ON booking.ticket (booking_id);
	CREATE INDEX ticket_trip_id_idx ON booking.ticket (trip_id);
	CREATE INDEX ticket_seat_id_idx ON booking.ticket (seat_id);
	CREATE INDEX ticket_trip_station_idx ON booking.ticket (trip_id, from_station_id, to_station_id);

	CREATE TABLE booking.seat_segment (
		id SERIAL PRIMARY KEY,
		trip_id INT REFERENCES operation.trip (id),
		seat_id INT REFERENCES organization.seat (id),
		from_station_id INT REFERENCES operation.station (id),
		to_station_id INT REFERENCES operation.station (id),
		ticket_id INT REFERENCES booking.ticket (id)
	);

	CREATE INDEX seat_segment_trip_id_idx ON booking.seat_segment (trip_id);
	CREATE INDEX seat_segment_trip_seat_idx ON booking.seat_segment (trip_id, seat_id);
	CREATE INDEX seat_segment_trip_station_idx ON booking.seat_segment (trip_id, from_station_id, to_station_id);
	CREATE INDEX seat_segment_ticket_id_idx ON booking.seat_segment (ticket_id);
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS booking CASCADE;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

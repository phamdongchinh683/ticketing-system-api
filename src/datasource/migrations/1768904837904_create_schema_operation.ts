import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS operation;

	CREATE TYPE operation.trip_status AS ENUM (
		'scheduled',
		'running',
		'completed',
		'cancelled'
	);
	CREATE TYPE operation.trip_event_type AS ENUM (
		'departed',
		'delayed',
		'arrived',
		'cancelled'
	);

	CREATE TABLE operation.route (
		id SERIAL PRIMARY KEY,
		from_location VARCHAR(100),
		to_location VARCHAR(100),
		distance_km INT,
		duration_minutes INT,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE TABLE operation.station (
		id SERIAL PRIMARY KEY,
		name VARCHAR(150),
		city VARCHAR(100),
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX station_city_idx ON operation.station (city);
	CREATE INDEX station_name_idx ON operation.station (name);

	CREATE TABLE operation.trip (
		id SERIAL PRIMARY KEY,
		route_id INT REFERENCES operation.route (id),
		vehicle_id INT REFERENCES organization.vehicle (id),
		driver_id INT REFERENCES auth.user (id),
		departure_date DATE,
		status operation.trip_status,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX trip_departure_status_idx ON operation.trip (departure_date, status);
	CREATE INDEX trip_vehicle_id_idx ON operation.trip (vehicle_id);
	CREATE INDEX trip_route_id_idx ON operation.trip (route_id);
	CREATE INDEX trip_driver_id_idx ON operation.trip (driver_id);

	CREATE TABLE operation.trip_stop (
		id SERIAL PRIMARY KEY,
		trip_id INT REFERENCES operation.trip (id),
		station_id INT REFERENCES operation.station (id),
		stop_order INT,
		arrival_time TIMESTAMP,
		departure_time TIMESTAMP,
		allow_pickup BOOLEAN,
		allow_dropoff BOOLEAN,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX trip_stop_trip_id_idx ON operation.trip_stop (trip_id);
	CREATE INDEX trip_stop_station_id_idx ON operation.trip_stop (station_id);
	CREATE INDEX trip_stop_trip_station_idx ON operation.trip_stop (trip_id, station_id);
	CREATE INDEX trip_stop_trip_order_idx ON operation.trip_stop (trip_id, stop_order);
	CREATE INDEX trip_stop_order_idx ON operation.trip_stop (stop_order);

	CREATE TABLE operation.trip_event (
		id SERIAL PRIMARY KEY,
		trip_id INT REFERENCES operation.trip (id),
		event operation.trip_event_type,
		note TEXT,
		created_at TIMESTAMP
	);

	CREATE INDEX trip_event_trip_id_idx ON operation.trip_event (trip_id);
	CREATE INDEX trip_event_event_idx ON operation.trip_event (event);
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS operation CASCADE;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

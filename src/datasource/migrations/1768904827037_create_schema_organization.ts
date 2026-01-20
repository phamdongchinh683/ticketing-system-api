import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS organization;

	CREATE TYPE organization.vehicle_type AS ENUM ('seat', 'bed');
	CREATE TYPE organization.vehicle_status AS ENUM ('active', 'maintenance', 'inactive');

	CREATE TABLE organization.bus_company (
		id SERIAL PRIMARY KEY,
		name VARCHAR(150),
		hotline VARCHAR(20),
		logo_url VARCHAR(255),
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE TABLE organization.vehicle (
		id SERIAL PRIMARY KEY,
		plate_number VARCHAR(20) UNIQUE,
		type organization.vehicle_type,
		company_id INT REFERENCES organization.bus_company (id),
		total_seats INT,
		status organization.vehicle_status,
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX vehicle_company_id_idx ON organization.vehicle (company_id);
	CREATE INDEX vehicle_status_idx ON organization.vehicle (status);

	CREATE TABLE organization.seat (
		id SERIAL PRIMARY KEY,
		vehicle_id INT REFERENCES organization.vehicle (id),
		seat_number VARCHAR(10),
		created_at TIMESTAMP,
		update_at TIMESTAMP
	);

	CREATE INDEX seat_vehicle_id_idx ON organization.seat (vehicle_id);
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS organization CASCADE;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

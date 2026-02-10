import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE TABLE operation.trip_schedule (
		id SERIAL PRIMARY KEY,
		company_id INT REFERENCES organization.bus_company (id),
		route_id INT REFERENCES operation.route (id),
		departure_time TIME,
		start_date DATE,
		end_date DATE,
		status BOOLEAN,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);

	CREATE INDEX trip_schedules_company_id_idx ON operation.trip_schedule (company_id);
	CREATE INDEX trip_schedules_route_id_idx ON operation.trip_schedule (route_id);
	CREATE INDEX trip_schedules_company_route_idx ON operation.trip_schedule (company_id, route_id);

	CREATE TABLE operation.trip_stop_template (
		id INT PRIMARY KEY,
		schedule_id INT REFERENCES operation.trip_schedule (id),
		station_id INT REFERENCES operation.station (id),
		stop_order INT,
		allow_pickup BOOLEAN,	
		allow_dropoff BOOLEAN,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);

	CREATE TABLE operation.trip_stop_template (
		id INT PRIMARY KEY,
		company_id INT REFERENCES organization.bus_company (id),
		route_id INT REFERENCES operation.route (id),
		from_station_id INT REFERENCES operation.station (id),
		to_station_id INT REFERENCES operation.station (id),
		price DECIMAL,
		status BOOLEAN,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);

	CREATE TRIGGER trip_schedules_set_timestamps
	BEFORE INSERT OR UPDATE ON operation.trip_schedule
	FOR EACH ROW
	EXECUTE FUNCTION set_timestamps();

	CREATE TRIGGER trip_stop_templates_set_timestamps
	BEFORE INSERT OR UPDATE ON operation.trip_stop_template
	FOR EACH ROW
	EXECUTE FUNCTION set_timestamps();

	CREATE TRIGGER trip_price_templates_set_timestamps
	BEFORE INSERT OR UPDATE ON operation.trip_stop_template
	FOR EACH ROW
	EXECUTE FUNCTION set_timestamps();
`

const DOWN = sql`
	DROP TRIGGER IF EXISTS trip_price_templates_set_timestamps ON operation.trip_stop_template;
	DROP TRIGGER IF EXISTS trip_stop_templates_set_timestamps ON operation.trip_stop_template;
	DROP TRIGGER IF EXISTS trip_schedules_set_timestamps ON operation.trip_schedule;

	DROP TABLE IF EXISTS operation.trip_stop_template;
	DROP TABLE IF EXISTS operation.trip_schedule;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

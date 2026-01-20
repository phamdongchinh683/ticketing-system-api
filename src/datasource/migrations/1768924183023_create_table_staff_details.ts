import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE TABLE auth.staff_detail (
		id SERIAL PRIMARY KEY,
		user_id INT UNIQUE REFERENCES auth.user (id) ON DELETE CASCADE,
		company_id INT REFERENCES organization.bus_company (id),
		staff_code VARCHAR(30) UNIQUE,
		position VARCHAR(100),
		department VARCHAR(100),
		phone VARCHAR(20),
		email VARCHAR(100),
		identity_number VARCHAR(50),
		hire_date DATE,
		status auth.user_status,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);

	CREATE INDEX staff_detail_user_id_idx ON auth.staff_detail (user_id);
	CREATE INDEX staff_detail_company_id_idx ON auth.staff_detail (company_id);
	CREATE INDEX staff_detail_staff_code_idx ON auth.staff_detail (staff_code);
	CREATE INDEX staff_detail_status_idx ON auth.staff_detail (status);
`

const DOWN = sql`
	DROP TABLE IF EXISTS auth.staff_detail;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

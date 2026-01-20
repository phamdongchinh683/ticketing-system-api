import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
	CREATE SCHEMA IF NOT EXISTS audit;

	CREATE TABLE audit.audit_log (
		id SERIAL PRIMARY KEY,
		user_id INT REFERENCES auth.user (id),
		action VARCHAR(100),
		target_type VARCHAR(50),
		target_id INT,
		old_data JSON,
		new_data JSON,
		created_at TIMESTAMP
	);

	CREATE INDEX audit_log_user_id_idx ON audit.audit_log (user_id);
	CREATE INDEX audit_log_target_idx ON audit.audit_log (target_type, target_id);
	CREATE INDEX audit_log_created_at_idx ON audit.audit_log (created_at);
`

const DOWN = sql`
	DROP SCHEMA IF EXISTS audit CASCADE;
`

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE auth.staff_profile
			ADD CONSTRAINT staff_profile_user_id_unique UNIQUE (user_id);
	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		ALTER TABLE auth.staff_profile
			DROP CONSTRAINT IF EXISTS staff_profile_user_id_unique;
	`.execute(db)
}

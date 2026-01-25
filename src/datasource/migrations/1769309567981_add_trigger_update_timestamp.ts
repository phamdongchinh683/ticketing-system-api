import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await sql`
		CREATE OR REPLACE FUNCTION set_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.updated_at := COALESCE(NEW.updated_at, NOW());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

	`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await sql`
		DROP FUNCTION IF EXISTS set_timestamps();
	`.execute(db)
}

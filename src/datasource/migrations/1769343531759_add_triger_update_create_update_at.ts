import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
DO $$
DECLARE
  r RECORD;
BEGIN
  CREATE OR REPLACE FUNCTION set_timestamps()
  RETURNS TRIGGER AS $fn$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      NEW.created_at := COALESCE(NEW.created_at, NOW());
      NEW.updated_at := COALESCE(NEW.updated_at, NOW());
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.updated_at := NOW();
    END IF;
    RETURN NEW;
  END;
  $fn$ LANGUAGE plpgsql;

  FOR r IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name IN ('created_at', 'updated_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.triggers
      WHERE event_object_schema = r.table_schema
        AND event_object_table = r.table_name
        AND trigger_name = r.table_name || '_set_timestamps'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER %I
         BEFORE INSERT OR UPDATE ON %I.%I
         FOR EACH ROW
         EXECUTE FUNCTION set_timestamps();',
        r.table_name || '_set_timestamps',
        r.table_schema,
        r.table_name
      );
    END IF;
  END LOOP;
END $$;
`

export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

const DOWN = sql`
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT trigger_name, event_object_schema, event_object_table
    FROM information_schema.triggers
    WHERE trigger_name LIKE '%_set_timestamps'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I.%I;',
      r.trigger_name,
      r.event_object_schema,
      r.event_object_table
    );
  END LOOP;

  DROP FUNCTION IF EXISTS set_timestamps();
END $$;
`

export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

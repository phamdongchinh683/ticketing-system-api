import type { Kysely } from 'kysely'
import { sql } from 'kysely'

const UP = sql`
DO $$
DECLARE
  r RECORD;
BEGIN
  -- 1️⃣ Add columns if not exists
  FOR r IN
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog', 'information_schema')
  LOOP
    -- created_at
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = r.table_schema
        AND table_name = r.table_name
        AND column_name = 'created_at'
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN created_at TIMESTAMP;',
        r.table_schema,
        r.table_name
      );
    END IF;

    -- updated_at
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = r.table_schema
        AND table_name = r.table_name
        AND column_name = 'updated_at'
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN updated_at TIMESTAMP;',
        r.table_schema,
        r.table_name
      );
    END IF;
  END LOOP;

  -- 2️⃣ Create function
  CREATE OR REPLACE FUNCTION set_created_updated_at()
  RETURNS TRIGGER AS $fn$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      NEW.created_at := COALESCE(NEW.created_at, now());
      NEW.updated_at := COALESCE(NEW.updated_at, now());
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.updated_at := now();
    END IF;
    RETURN NEW;
  END;
  $fn$ LANGUAGE plpgsql;

  -- 3️⃣ Create trigger
  FOR r IN
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog', 'information_schema')
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE event_object_schema = r.table_schema
        AND event_object_table = r.table_name
        AND trigger_name = r.table_name || '_timestamps'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER %I
         BEFORE INSERT OR UPDATE ON %I.%I
         FOR EACH ROW
         EXECUTE FUNCTION set_created_updated_at();',
        r.table_name || '_timestamps',
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
  -- Drop triggers
  FOR r IN
    SELECT trigger_name, event_object_schema, event_object_table
    FROM information_schema.triggers
    WHERE trigger_name LIKE '%_timestamps'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I.%I;',
      r.trigger_name,
      r.event_object_schema,
      r.event_object_table
    );
  END LOOP;

  DROP FUNCTION IF EXISTS set_created_updated_at();
END $$;
`

export async function down(db: Kysely<any>): Promise<void> {
  await DOWN.execute(db)
}

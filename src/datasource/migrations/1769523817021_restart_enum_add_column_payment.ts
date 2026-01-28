import type { Kysely } from 'kysely'
import { sql } from 'kysely'


const UP = sql`
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'payment'
          AND t.typname = 'payment_method'
    ) THEN
        EXECUTE 'ALTER TYPE payment.payment_method RENAME TO payment_payment_method_old';
    END IF;
END $$;
CREATE TYPE payment.payment_method AS ENUM ('cash', 'vnpay');

ALTER TABLE payment.payment
    ALTER COLUMN method TYPE payment.payment_method
    USING (
        CASE
            WHEN method::text = 'vnpay' THEN 'vnpay'::payment.payment_method
            ELSE 'cash'::payment.payment_method
        END
    );

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'payment'
          AND t.typname = 'payment_payment_method_old'
    ) THEN
        EXECUTE 'DROP TYPE payment.payment_payment_method_old';
    END IF;
END $$;

ALTER TABLE payment.payment
    ADD COLUMN IF NOT EXISTS transaction_no VARCHAR(100);
`

const DOWN = sql`
ALTER TABLE payment.payment
    DROP COLUMN IF EXISTS transaction_no;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'payment'
          AND t.typname = 'payment_method'
    ) THEN
        EXECUTE 'ALTER TYPE payment.payment_method RENAME TO payment_payment_method_new';
    END IF;
END $$;
CREATE TYPE payment.payment_method AS ENUM ('cash', 'vnpay');

ALTER TABLE payment.payment
    ALTER COLUMN method TYPE payment.payment_method
    USING (method::text::payment.payment_method);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'payment'
          AND t.typname = 'payment_payment_method_new'
    ) THEN
        EXECUTE 'DROP TYPE payment.payment_payment_method_new';
    END IF;
END $$;
`

export async function up(db: Kysely<any>): Promise<void> {
    await UP.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await DOWN.execute(db)
}

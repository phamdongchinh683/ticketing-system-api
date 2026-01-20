import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await sql`
        ALTER TABLE auth.user
        ADD CONSTRAINT user_email_key UNIQUE (email),
        ADD CONSTRAINT user_phone_key UNIQUE (phone);
    `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    await sql`
        ALTER TABLE auth.user
        DROP CONSTRAINT user_email_key,
        DROP CONSTRAINT user_phone_key;
    `.execute(db)
}

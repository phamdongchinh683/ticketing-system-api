import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from 'kysely'
import { Pool, types } from 'pg'

import { Database } from './type.js'

const toNumber = (v: null | string) => (v ? +v : null)

types.setTypeParser(types.builtins.INT2, toNumber)
types.setTypeParser(types.builtins.INT4, toNumber)
types.setTypeParser(types.builtins.INT8, toNumber)
types.setTypeParser(types.builtins.FLOAT4, toNumber)
types.setTypeParser(types.builtins.FLOAT8, toNumber)
types.setTypeParser(types.builtins.NUMERIC, toNumber)

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 2,
    min: 0,
})

const dialect = new PostgresDialect({ pool })

export const db = new Kysely<Database>({
    dialect,
    log(event) {
        if (event.level === 'error') {
            console.error('Query failed : ', {
                durationMs: event.queryDurationMillis,
                error: event.error,
                params: event.query.parameters,
                sql: event.query.sql,
            })
        } else {
            console.log('Query executed : ', {
                durationMs: event.queryDurationMillis,
                params: event.query.parameters,
                sql: event.query.sql,
            })
        }
    },
    plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
})

import { ColumnType } from 'kysely'

export interface Timestamps {
    createdAt: ColumnType<Date, never, never>
    updatedAt: ColumnType<Date, never, never>
}

import { db } from '../../../datasource/db.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'
import { TripPriceTemplateFilter } from '../../../model/query/trip-price-template/index.js'
import { OperationTripPriceTemplateId } from './type.js'
import { OperationTripPriceTemplateTableUpdate } from './table.js'

export async function findAllByCompanyId(params: {
    q: TripPriceTemplateFilter
    companyId: OrganizationBusCompanyId
}) {
    const { q, companyId } = params
    return db
        .selectFrom('operation.trip_price_template as tpt')
        .where('tpt.companyId', '=', companyId)
        .where(eb => {
            const cond = []
            cond.push(eb('tpt.companyId', '=', companyId))
            if (q.next) {
                cond.push(eb('tpt.id', '>', q.next))
            }
            return eb.and(cond)
        })
        .selectAll()
        .limit(q.limit + 1)
        .orderBy('tpt.id')
        .execute()
}

export async function updateOneById(
    id: OperationTripPriceTemplateId,
    body: OperationTripPriceTemplateTableUpdate
) {
    return db
        .updateTable('operation.trip_price_template as tpt')
        .set(body)
        .where('tpt.id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
}

import { dal } from '../../index.js'
import { OperationTripScheduleId } from '../trip-schedule/type.js'
import { OperationRouteId } from '../route/type.js'
import { OrganizationBusCompanyId } from '../../organization/bus_company/type.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { db } from '../../../datasource/db.js'
import { OperationStationId } from '../station/type.js'

export async function findAllPriceByScheduleId(
    params: { routeId: OperationRouteId; companyId: OrganizationBusCompanyId },
    trx?: Transaction<Database>
) {
    const { routeId, companyId } = params
    return (trx ?? db)
        .selectFrom('operation.trip_price_template as tpt')
        .where(eb => {
            const cond = []
            cond.push(eb('tpt.companyId', '=', companyId))
            cond.push(eb('tpt.routeId', '=', routeId))
            return eb.and(cond)
        })
        .selectAll()
        .execute()
}

export async function getPriceByCompanyId(
    params: {
        companyId: OrganizationBusCompanyId,
        fromStationId: OperationStationId,
        toStationId: OperationStationId
    },
    trx?: Transaction<Database>
) {
    const { companyId, fromStationId, toStationId } = params
    return (trx ?? db)
        .selectFrom('operation.trip_price_template as tpt')
        .where(eb => eb.and([eb('tpt.companyId', '=', companyId), eb('tpt.fromStationId', '=', fromStationId), eb('tpt.toStationId', '=', toStationId)]))
        .select(['tpt.price'])
        .executeTakeFirst()
}
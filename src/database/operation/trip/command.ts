import { DriverTripQuery, TripFilter } from '../../../model/query/trip/index.js'
import { dal } from '../../index.js'
import { TripBody } from '../../../model/body/trip/index.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { OperationTripId, OperationTripStatus } from './type.js'
import { OperationTripTableInsert } from './table.js'
import { db } from '../../../datasource/db.js'
import { utils } from '../../../utils/index.js'
import { AuthUserId } from '../../auth/user/type.js'
import _ from 'lodash'
import { OperationTripScheduleId } from '../trip-schedule/type.js'
export async function getManyByFilter(params: TripFilter) {
    return dal.operation.trip.query.findAllByFilter(params)
}

export async function createTrip(params: OperationTripTableInsert, trx: Transaction<Database>) {
    const data = _.omitBy(params, (v) => _.isNil(v)) as OperationTripTableInsert;
    return trx.insertInto('operation.trip').values(data).returning('id').executeTakeFirstOrThrow()
}

export async function findByScheduleIdAndDepartureDate(
    params: { scheduleId: OperationTripScheduleId; departureDate: Date },
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .selectFrom('operation.trip as t')
        .where(eb => {
            const cond = []
            cond.push(eb('t.scheduleId', '=', params.scheduleId))
            cond.push(eb('t.departureDate', '=', params.departureDate))
            return eb.and(cond)
        })
        .select('id')
        .executeTakeFirst()
}

export async function createTripTransaction(params: TripBody) {
    return db.transaction().execute(async trx => {
        const { scheduleId, departureDate } = params

        const result = await findByScheduleIdAndDepartureDate({ scheduleId, departureDate }, trx)

        if (result) return result

        const schedule = await dal.operation.tripSchedule.cmd.findByIdAndDate(
            { id: scheduleId, date: departureDate },
            trx
        )

        const [tripStopTemplates, tripPriceByTemplates] = await Promise.all([
            dal.operation.tripStopTemplate.cmd.findAllByScheduleId(
                { scheduleId, routeId: schedule.routeId, companyId: schedule.companyId },
                trx
            ),
            dal.operation.tripPriceTemplate.cmd.findAllPriceByScheduleId(
                { routeId: schedule.routeId, companyId: schedule.companyId },
                trx
            ),
        ])

        const trip = await createTrip(
            {
                scheduleId: schedule.id,
                departureDate: departureDate,
                routeId: schedule.routeId,
                status: OperationTripStatus.enum.scheduled,
            },
            trx
        )

        const baseDate = utils.time.formatDateOnly(departureDate)
        const departureTime = utils.time.formatTimeOnly(schedule.departureTime)
        const date = `${baseDate}T${departureTime}`

        await dal.operation.tripStop.cmd.createTripStopBulk(
            tripStopTemplates.map(t => ({
                tripId: trip.id,
                stationId: t.stationId,
                stopOrder: t.stopOrder,
                arrivalTime: utils.time.addMinutes(date, t.arrivalOffsetMin),
                departureTime: utils.time.addMinutes(date, t.departureOffsetMin),
                allowPickup: t.allowPickup,
                allowDropoff: t.allowDropoff,
            })),
            trx
        )

        await dal.operation.tripPrice.cmd.createTripPriceBulk(
            tripPriceByTemplates.map(t => ({
                tripId: trip.id,
                fromStationId: t.fromStationId,
                toStationId: t.toStationId,
                price: t.price,
                currency: 'VND',
                isActive: t.status,
            })),
            trx
        )

        return trip
    })
}

export async function getManyByDriverId(params: DriverTripQuery, userId: AuthUserId) {
    return dal.operation.trip.query.findAllByDriverId(params, userId)
}

export async function updateStatus(
    params: { id: OperationTripId; status: OperationTripStatus; userId: AuthUserId },
    trx?: Transaction<Database>
) {
    return (trx ?? db)
        .updateTable('operation.trip')
        .set({ status: params.status, driverId: params.userId })
        .where('id', '=', params.id)
        .returningAll()
        .executeTakeFirstOrThrow()
}

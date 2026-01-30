import { TripFilter } from '../../../model/query/trip/index.js'
import { dal } from '../../index.js'
import { TripBody } from '../../../model/body/trip/index.js'
import { Transaction } from 'kysely'
import { Database } from '../../../datasource/type.js'
import { OperationTripStatus } from './type.js'
import { OperationTripTableInsert } from './table.js'
import { db } from '../../../datasource/db.js'
import { utils } from '../../../utils/index.js'
export async function getManyByFilter(params: TripFilter) {
    return dal.operation.trip.query.findAllByFilter(params)
}

export async function createTrip(params: OperationTripTableInsert, trx: Transaction<Database>) {
    return trx.insertInto('operation.trip').values(params).returning('id').executeTakeFirstOrThrow()
}

export async function createTripTransaction(params: TripBody) {
    return db.transaction().execute(async trx => {
        const { scheduleId, departureDate } = params

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
                vehicleId: (await dal.organization.vehicle.cmd.randomVehicle(schedule.companyId, trx)).id,
                driverId: null,
                status: OperationTripStatus.enum.scheduled,
            },
            trx
        )

        const baseDate = utils.time.formatDateOnly(departureDate)
        const departureTime = utils.time.formatTimeOnly(schedule.departureTime)
        const date = `${baseDate}T${departureTime}`

        console.log(date)

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

import { db } from '../../../datasource/db.js'
import { AuthUserId } from '../../auth/user/type.js'
import { TicketFilter } from '../../../model/query/ticket/index.js'
import { BookingTicketId } from './type.js'

export async function findAll(q: TicketFilter, userId: AuthUserId) {
    const { limit, next } = q
    return db
        .selectFrom('booking.ticket as t')
        .innerJoin('booking.booking as b', 'b.id', 't.bookingId')
        .innerJoin('operation.trip as trip', 'trip.id', 't.tripId')
        .where(eb => {
            const cond = []
            cond.push(eb('b.userId', '=', userId))
            if (next) {
                cond.push(eb('t.id', '>', next))
            }
            if (q.type) {
                cond.push(eb('b.bookingType', '=', q.type))
            }
            if (q.status) {
                cond.push(eb('t.status', '=', q.status))
            }
            return eb.and(cond)
        })
        .select([
            't.id',
            'b.code',
            'b.bookingType',
            'b.originalAmount',
            'b.discountAmount',
            'b.totalAmount',
            'b.status',
            'trip.departureDate',
        ])
        .orderBy('trip.departureDate', 'desc')
        .limit(limit + 1)
        .execute()
}

export async function findById(id: BookingTicketId, userId: AuthUserId) {
    return db
        .selectFrom('booking.ticket as t')
        .leftJoin('booking.booking as b', 'b.id', 't.bookingId')
        .leftJoin('operation.trip as trip', 'trip.id', 't.tripId')
        .leftJoin('organization.seat as seat', 'seat.id', 't.seatId')
        .leftJoin('operation.route as route', 'route.id', 'trip.routeId')
        .leftJoin('operation.station as fs', 'fs.id', 't.fromStationId')
        .leftJoin('operation.station as ts', 'ts.id', 't.toStationId')
        .leftJoin('operation.trip_price as tp', 'tp.tripId', 'trip.id')
        .leftJoin('organization.vehicle as v', 'v.id', 'trip.vehicleId')
        .where(eb => {
            const cond = []
            cond.push(eb('t.id', '=', id))
            cond.push(eb('b.userId', '=', userId))
            return eb.and(cond)
        })
        .select([
            't.id',
            'b.code',
            'b.bookingType',
            'b.originalAmount',
            'b.discountAmount',
            'b.totalAmount',
            'b.status',
            'seat.seatNumber',
            'v.plateNumber',
            'v.type',
            'route.fromLocation',
            'route.toLocation',
            'tp.price',
            'tp.currency',
            'trip.departureDate',
        ])
        .executeTakeFirstOrThrow()
}

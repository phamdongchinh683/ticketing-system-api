import { db } from '../../../datasource/db.js'
import { sql } from 'kysely'
import { AuthUserId } from '../../auth/user/type.js'
import { OperationTripId } from '../../operation/trip/type.js'
import { PassengerTicketFilter, TicketFilter } from '../../../model/query/ticket/index.js'
import { BookingTicketId, BookingTicketStatus } from './type.js'
import { BookingStatus } from '../booking/type.js'

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
        .leftJoin('operation.trip_schedule as tsp', 'tsp.id', 'trip.scheduleId')
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
            'tp.currency',
            'tsp.departureTime',
            'trip.departureDate',
        ])
        .executeTakeFirstOrThrow()
}

export async function findPassengersByDriverAndTripId(
    params: {
        driverId: AuthUserId
        tripId: OperationTripId
    },
    query: PassengerTicketFilter
) {
    const { driverId, tripId } = params
    const { limit, next, phoneNumber } = query
    return db
        .selectFrom('booking.ticket as t')
        .innerJoin('booking.booking as b', 'b.id', 't.bookingId')
        .innerJoin('auth.user as u', 'u.id', 'b.userId')
        .innerJoin('operation.trip as trip', 'trip.id', 't.tripId')
        .leftJoin('organization.seat as seat', 'seat.id', 't.seatId')
        .leftJoin('operation.station as fs', 'fs.id', 't.fromStationId')
        .leftJoin('operation.station as ts', 'ts.id', 't.toStationId')
        .where(eb => {
            const cond = []
            cond.push(eb('trip.id', '=', tripId))
            cond.push(eb('trip.driverId', '=', driverId))
            cond.push(eb('b.status', '=', BookingStatus.enum.paid))
            cond.push(
                eb('t.status', 'in', [
                    BookingTicketStatus.enum.paid,
                    BookingTicketStatus.enum.reserved,
                ])
            )
            if (phoneNumber) {
                cond.push(eb('u.phone', '=', phoneNumber))
            }
            if (next) {
                cond.push(eb('t.id', '>', next))
            }
            return eb.and(cond)
        })
        .select([
            't.id',
            'u.phone as phoneNumber',
            sql<string>`COALESCE(u.full_name, u.username)`.as('fullName'),
            'seat.seatNumber',
            'b.status',
            'fs.address as pickup',
            'ts.address as dropoff',
        ])
        .orderBy('seat.seatNumber')
        .limit(limit + 1)
        .execute()
}

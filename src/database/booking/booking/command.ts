import _ from 'lodash'
import { db } from '../../../datasource/db.js'
import { BookingRequest } from '../../../model/body/booking/index.js'
import { utils } from '../../../utils/index.js'
import { BookingId, BookingStatus, BookingType } from './type.js'
import { BookingTicketStatus } from '../ticket/type.js'
import { Database } from '../../../datasource/type.js'
import { Transaction } from 'kysely'
import { BookingTableInsert } from './table.js'
import { dal } from '../../index.js'
import { AuthUserId } from '../../auth/user/type.js'
import { applyCoupon, validateCoupon } from '../../../business/booking/coupon.js'
import { BookingCouponId } from '../coupon/type.js'
import { OperationTripId } from '../../operation/trip/type.js'
import { HttpErr } from '../../../app/index.js'

export async function createOne(params: BookingRequest, userId: AuthUserId) {
    const { returnBound, type } = params

    if (type === BookingType.enum.one_way) {
        return createOneWayBooking(params, userId)
    } else if (type === BookingType.enum.round_trip && returnBound) {
        return createRoundTripBooking(params, userId)
    }
}

async function resultAmounts(tripId: OperationTripId, couponId?: BookingCouponId) {
    const originalAmount = await dal.operation.tripPrice.query.findOneByTripId(tripId)

    if (couponId) {
        const coupon = await dal.booking.coupon.cmd.getCouponByCode({
            id: couponId,
            orderTotal: originalAmount.price,
        })
        if (coupon) {
            validateCoupon(coupon, originalAmount.price)
            const { discountAmount, finalTotal } = applyCoupon(coupon, originalAmount.price)
            return {
                originalAmount: originalAmount.price,
                discountAmount,
                totalAmount: finalTotal,
            }
        }
    }

    return {
        originalAmount: originalAmount.price,
        discountAmount: 0,
        totalAmount: originalAmount.price,
    }
}

async function createOneWayBooking(params: BookingRequest, userId: AuthUserId) {
    const { couponId, outBound } = params
    return db.transaction().execute(async tx => {
        const { originalAmount, discountAmount, totalAmount } = await resultAmounts(
            outBound.tripId,
            couponId
        )

        const seatConflict = await dal.booking.seatSegment.cmd.lockSeatSegmentsTransaction(
            outBound,
            tx
        )
        if (seatConflict) {
            throw new HttpErr.UnprocessableEntity(
                'Seat is already reserved for the selected segment',
                'SEAT_CONFLICT'
            )
        }

        const booking = await createBookingTransaction(
            {
                userId,
                couponId: couponId ?? null,
                code: utils.random.generateRandomString(20),
                bookingType: BookingType.enum.one_way,
                originalAmount,
                totalAmount: totalAmount,
                discountAmount: discountAmount,
                status: BookingStatus.enum.pending,
                expiredAt: utils.time.getNow().add(utils.time.coolDownTime, 'seconds').toDate(),
            },
            tx
        )

        const ticket = await dal.booking.ticket.cmd.createTicketTransaction(
            {
                bookingId: booking.id,
                tripId: outBound.tripId,
                seatId: outBound.seatId,
                fromStationId: outBound.fromStationId,
                toStationId: outBound.toStationId,
                status: BookingTicketStatus.enum.reserved,
            },
            tx
        )

        await dal.booking.seatSegment.cmd.createSeatSegmentTransaction(
            {
                tripId: outBound.tripId,
                seatId: outBound.seatId,
                fromStationId: outBound.fromStationId,
                toStationId: outBound.toStationId,
                ticketId: ticket.id,
            },
            tx
        )

        return {
            id: booking.id,
            expiredAt: booking.expiredAt,
            message: 'Your ticket will be held for ten minutes please choose your payment method',
        }
    })
}

async function createRoundTripBooking(params: BookingRequest, userId: AuthUserId) {
    const { couponId, outBound, returnBound } = params
    if (outBound && returnBound) {
        return db.transaction().execute(async tx => {
            const result = await dal.operation.tripPrice.cmd.countPriceByTripIds(
                [outBound.tripId, returnBound.tripId],
                tx
            )

            if (couponId) {
                await resultAmounts(outBound.tripId, couponId)
            }

            const outBoundConflict = await dal.booking.seatSegment.cmd.lockSeatSegmentsTransaction(
                outBound,
                tx
            )
            if (outBoundConflict) {
                throw new HttpErr.UnprocessableEntity(
                    'Outbound seat is already reserved for the selected segment',
                    'SEAT_CONFLICT_OUTBOUND'
                )
            }
            const returnBoundConflict =
                await dal.booking.seatSegment.cmd.lockSeatSegmentsTransaction(returnBound, tx)
            if (returnBoundConflict) {
                throw new HttpErr.UnprocessableEntity(
                    'Return seat is already reserved for the selected segment',
                    'SEAT_CONFLICT_RETURN'
                )
            }
            const booking = await createBookingTransaction(
                {
                    userId,
                    couponId: couponId ?? null,
                    code: utils.random.generateRandomString(20),
                    bookingType: BookingType.enum.round_trip,
                    totalAmount: result.count,
                    originalAmount: result.count,
                    status: BookingStatus.enum.pending,
                    expiredAt: utils.time.getNext({ second: utils.time.coolDownTime }),
                },
                tx
            )

            const ticket = await dal.booking.ticket.cmd.insertManyTicketsTransaction(
                [
                    {
                        bookingId: booking.id,
                        tripId: outBound.tripId,
                        seatId: outBound.seatId,
                        fromStationId: outBound.fromStationId,
                        toStationId: outBound.toStationId,
                        status: BookingTicketStatus.enum.reserved,
                    },
                    {
                        bookingId: booking.id,
                        tripId: returnBound.tripId,
                        seatId: returnBound.seatId,
                        fromStationId: returnBound.fromStationId,
                        toStationId: returnBound.toStationId,
                        status: BookingTicketStatus.enum.reserved,
                    },
                ],
                tx
            )

            await dal.booking.seatSegment.cmd.insertManySeatSegmentsTransaction(
                [
                    {
                        tripId: outBound.tripId,
                        seatId: outBound.seatId,
                        fromStationId: outBound.fromStationId,
                        toStationId: outBound.toStationId,
                        ticketId: ticket[0].id,
                    },
                    {
                        tripId: returnBound.tripId,
                        seatId: returnBound.seatId,
                        fromStationId: returnBound.fromStationId,
                        toStationId: returnBound.toStationId,
                        ticketId: ticket[1].id,
                    },
                ],
                tx
            )

            return {
                id: booking.id,
                expiredAt: booking.expiredAt,
                message:
                    'Your ticket will be held for ten minutes please choose your payment method',
            }
        })
    }
}

async function createBookingTransaction(params: BookingTableInsert, trx: Transaction<Database>) {
    const data = _.omitBy(params, v => _.isNil(v)) as BookingTableInsert

    return trx.insertInto('booking.booking').values(data).returningAll().executeTakeFirstOrThrow()
}

export async function updateBookingStatus(
    bookingId: BookingId,
    status: BookingStatus,
    trx: Transaction<Database>
) {
    return trx.updateTable('booking.booking').set({ status }).where('id', '=', bookingId).execute()
}

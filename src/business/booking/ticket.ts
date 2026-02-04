import { BookingTicketId, BookingTicketStatus } from '../../database/booking/ticket/type.js'
import { AuthUserId } from '../../database/auth/user/type.js'
import { dal } from '../../database/index.js'
import { TicketFilter } from '../../model/query/ticket/index.js'
import { HttpErr } from '../../app/index.js'
import { BookingStatus } from '../../database/booking/booking/type.js'
import { utils } from '../../utils/index.js'
import { OperationTripId } from '../../database/operation/trip/type.js'

export async function getTickets(q: TicketFilter, userId: AuthUserId) {
    const tickets = await dal.booking.ticket.query.findAll(q, userId)
    const hasNextPage = tickets.length > q.limit
    const data = hasNextPage ? tickets.slice(0, q.limit) : tickets
    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        tickets: data,
        next,
    }
}

export async function detailTicket(id: BookingTicketId, userId: AuthUserId) {
    const ticket = await dal.booking.ticket.query.findById(id, userId)
    return {
        ticket: ticket,
    }
}

export async function cancelTicket(id: BookingTicketId, userId: AuthUserId) {
    const data = await dal.booking.booking.query.getBookingByUserIdAndBookingId({
        userId: userId,
        ticketId: id,
    })

    if (!data) {
        throw new HttpErr.Forbidden('You are not allowed to cancel this ticket')
    }

    if (
        data.status !== BookingStatus.enum.pending ||
        data.expiredAt < utils.time.getNow().toDate()
    ) {
        throw new HttpErr.Forbidden('This ticket has already been processed')
    }

    const tickets = await dal.booking.ticket.cmd.cancelTicketTransaction(id)
    return {
        message: 'OK',
        tickets: tickets,
    }
}

export async function checkInTicket(params: {
    id: BookingTicketId
    status: BookingTicketStatus
    tripId?: OperationTripId
}) {
    const ticket = await dal.booking.ticket.cmd.updateStatusTicket(params)
    return {
        message: 'OK',
        ticket: ticket,
    }
}

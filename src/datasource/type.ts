import { AuthStaffDetailTable } from '../database/auth/staff_detail/table.js'
import { AuthStaffProfileTable } from '../database/auth/staff_profile/table.js'
import { AuthUserTable } from '../database/auth/user/table.js'
import { PaymentTable } from '../database/payment/payment/table.js'
import { PaymentRefundTable } from '../database/payment/refund/table.js'
import { AuditLogTable } from '../database/audit/audit_log/table.js'
import { BookingTable } from '../database/booking/booking/table.js'
import { BookingTicketTable } from '../database/booking/ticket/table.js'
import { BookingSeatSegmentTable } from '../database/booking/seat_segment/table.js'
import { BookingCouponTable } from '../database/booking/coupon/table.js'
import { OperationTripTable } from '../database/operation/trip/table.js'
import { OperationStationTable } from '../database/operation/station/table.js'
import { OrganizationBusCompanyTable } from '../database/organization/bus_company/table.js'
import { OrganizationVehicleTable } from '../database/organization/vehicle/table.js'
import { OrganizationSeatTable } from '../database/organization/seat/table.js'
import { OperationRouteTable } from '../database/operation/route/table.js'
import { OperationTripStopTable } from '../database/operation/trip_stop/table.js'
import { OperationTripEventTable } from '../database/operation/trip_event/table.js'
import { OperationTripPriceTable } from '../database/operation/trip_price/table.js'

export interface Database {
    'auth.user': AuthUserTable
    'auth.staff_profile': AuthStaffProfileTable
    'auth.staff_detail': AuthStaffDetailTable
    'payment.payment': PaymentTable
    'payment.refund': PaymentRefundTable
    'audit.audit_log': AuditLogTable
    'booking.booking': BookingTable
    'booking.coupon': BookingCouponTable
    'booking.ticket': BookingTicketTable
    'booking.seat_segment': BookingSeatSegmentTable
    'operation.trip': OperationTripTable
    'operation.station': OperationStationTable
    'organization.bus_company': OrganizationBusCompanyTable
    'organization.vehicle': OrganizationVehicleTable
    'organization.seat': OrganizationSeatTable
    'operation.route': OperationRouteTable
    'operation.trip_stop': OperationTripStopTable
    'operation.trip_event': OperationTripEventTable
    'operation.trip_price': OperationTripPriceTable
}

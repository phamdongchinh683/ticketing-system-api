import { AuthUserId } from '../../database/auth/user/type.js'
import { dal } from '../../database/index.js'
import { OperationTripId } from '../../database/operation/trip/type.js'

export async function getRouterByTripId(params: {
    driverId: AuthUserId,
    tripId: OperationTripId,
}) {
    const { driverId, tripId } = params
    
    return {
        stops: await dal.operation.route.cmd.getRouterByDriverIdAndTripId({ driverId, tripId }),
    }
}

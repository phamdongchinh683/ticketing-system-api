import { dal } from '../../database/index.js'
import { OrganizationBusCompanyId } from '../../database/organization/bus_company/type.js'
import {
    OrganizationVehicleTableInsert,
    OrganizationVehicleTableUpdate,
} from '../../database/organization/vehicle/table.js'
import { OrganizationVehicleId } from '../../database/organization/vehicle/type.js'
import { VehicleFilter } from '../../model/query/vehicle/index.js'
import { utils } from '../../utils/index.js'

export async function getVehicles(query: VehicleFilter, companyId: OrganizationBusCompanyId) {
    const vehicles = await dal.organization.vehicle.query.findAll(query, companyId)
    const { data, next } = utils.common.paginateByCursor(vehicles, query.limit)
    return {
        vehicles: data,
        next: next,
    }
}

export async function createVehicle(params: OrganizationVehicleTableInsert) {
    return {
        vehicle: await dal.organization.vehicle.cmd.createOrganizationVehicle(params),
    }
}

export async function updateVehicle(
    id: OrganizationVehicleId,
    params: OrganizationVehicleTableUpdate
) {
    return {
        vehicle: await dal.organization.vehicle.cmd.updateOrganizationVehicle(id, params),
    }
}

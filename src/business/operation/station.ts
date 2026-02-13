import { StationFilter } from '../../model/query/station/index.js'
import { OrganizationBusCompanyId } from '../../database/organization/bus_company/type.js'
import { dal } from '../../database/index.js'
import { utils } from '../../utils/index.js'
import { StationBody } from '../../model/body/station/index.js'

export async function getStations(params: {
    q: StationFilter
    companyId: OrganizationBusCompanyId
}) {
    const stations = await dal.operation.station.query.findAllByCompanyId({
        q: params.q,
        companyId: params.companyId,
    })
    const { data, next } = utils.common.paginateByCursor(stations, params.q.limit)

    return {
        stations: data,
        next: next,
    }
}

export async function createStation(params: {
    body: StationBody
    companyId: OrganizationBusCompanyId
}) {
    return {
        station: await dal.operation.station.cmd.upsertOne({
            ...params.body,
            companyId: params.companyId,
        }),
    }
}

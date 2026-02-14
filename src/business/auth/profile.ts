import { dal } from '../../database/index.js'
import { UserInfo } from '../../model/common.js'
import _ from 'lodash'
import {
    AuthStaffDetailTableInsert,
    AuthStaffDetailTableUpdate,
} from '../../database/auth/staff_detail/table.js'
import { utils } from '../../utils/index.js'
import { AuthUserStatus } from '../../database/auth/user/type.js'

export async function getProfile(userInfo: UserInfo) {
    let user = await dal.auth.staffDetail.cmd.getOne(userInfo.id)

    const data = _.omitBy(
        {
            email: userInfo.email,
            phone: userInfo.phone,
            staffCode: utils.random.generateRandomNumber(6),
            status: AuthUserStatus.enum.active,
            userId: userInfo.id,
            companyId: userInfo.companyId,
        },
        v => _.isNil(v)
    ) as AuthStaffDetailTableInsert

    if (!user) {
        user = await dal.auth.staffDetail.cmd.upsertOne(data)
        return {
            user: user,
        }
    }

    return {
        user: user,
    }
}

export async function updateProfile(userInfo: UserInfo, params: AuthStaffDetailTableUpdate) {
    const data = _.omitBy(params, v => _.isNil(v)) as AuthStaffDetailTableUpdate

    return {
        user: await dal.auth.staffDetail.cmd.updateOne(userInfo.id, data),
    }
}
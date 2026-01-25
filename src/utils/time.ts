import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)

export const getNow = () => {
    return dayjs().utc()
}

export const getNext = (params: { second: number }) => {
    return getNow().add(params.second, 'seconds').toDate()
}

export const coolDownTime = 60 * 10 * 1000 // 10 minutes

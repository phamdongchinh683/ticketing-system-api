import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)

export const getNow = () => {
    return dayjs().utc()
}

export const getNext = (params: { second: number }) => {
    return getNow().add(params.second, 'seconds').toDate()
}

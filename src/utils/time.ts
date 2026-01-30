import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getNow = () => {
    return dayjs().utc()
}

export const getNext = (params: { second: number }) => {
    return getNow().add(params.second, 'seconds').toDate()
}

export const coolDownTime = 60 * 10 * 1000

export const buildAppTransId = (transactionCode: string) => {
    return `${getNow().format('YYMMDD')}_${transactionCode}`
}

export const addMinutes = (date: string, minutes: number | string | null | undefined) => {
    if (minutes === null || minutes === undefined) {
        return null
    }
    const value = typeof minutes === 'string' ? Number(minutes) : minutes
    if (!Number.isFinite(value)) {
        return null
    }
    const base = dayjs(date)
    if (!base.isValid()) {
        return null
    }
    return base.add(value, 'minute').toDate()
}

export const formatDateOnly = (date: Date | string) => {
    return dayjs(date).format('YYYY-MM-DD')
}

export const formatTimeOnly = (date: Date | string) => {
    if (typeof date === 'string') {
        const trimmed = date.trim()
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
            return trimmed.length === 5 ? `${trimmed}:00` : trimmed
        }
    }
    return dayjs(date).format('HH:mm:ss')
}

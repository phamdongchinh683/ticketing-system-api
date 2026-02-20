import { ContactInfo } from '../model/common.js'

export function parseContactInfo(contactInfo: ContactInfo) {
    return {
        email: contactInfo.email,
        phone: contactInfo.phone,
    }
}

export function paginateByCursor<T extends { id: number | string }>(items: T[], limit = 10) {
    const hasNextPage = items.length > limit
    const data = hasNextPage ? items.slice(0, limit) : items
    const next = hasNextPage ? data[data.length - 1]?.id : null

    return {
        data,
        next,
    }
}

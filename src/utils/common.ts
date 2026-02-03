import { ContactInfo } from '../model/common.js'

export function parseContactInfo(contactInfo: ContactInfo) {
    return {
        email: contactInfo.email,
        phone: contactInfo.phone,
    }
}

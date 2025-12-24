import { createHash } from 'node:crypto'

export function hashPassword(password: string): string {
    return createHash('md5').update(password).digest('hex')
}

export function verifyPassword(password: string, hashedPassword: null | string): boolean {
    console.log('hashPassword(password)', hashPassword(password))
    console.log('hashedPassword', hashedPassword)
    return hashPassword(password) === hashedPassword
}

export const UtilPassword = {
    hashPassword,
    verifyPassword,
}

import { createHash, randomBytes } from 'node:crypto'

export function generateRandomToken(): string {
    return randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
}

export const UtilToken = {
    generateRandomToken,
    hashToken,
}

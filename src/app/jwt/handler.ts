import { createSigner, createVerifier } from 'fast-jwt'

import { Unauthorized } from '../error-type.js'
import { HttpErr } from '../index.js'

const sign = createSigner({
    algorithm: 'HS256',
    expiresIn: `36525 days`,
    key: process.env.JWT_SECRET,
})
const verify = createVerifier({ key: process.env.JWT_SECRET })

export const generateToken = (payload: any): string => {
    return sign(payload)
}

interface Headers {
    authorization?: string
    Authorization?: string
}
const verifyToken = (headers: Headers): null => {
    const { authorization, Authorization } = headers
    const authHeader = authorization ?? Authorization
    if (!authHeader) return null

    const bearer = 'Bearer '
    const token = authHeader.startsWith(bearer) ? authHeader.slice(bearer.length) : authHeader

    let payload: unknown
    try {
        payload = verify(token)
    } catch (error) {
        console.error(error)
        throw new Unauthorized('Invalid authorization header')
    }

    let userInfo: any
    try {
        userInfo = payload
    } catch (error) {
        console.error(error)
        throw new Unauthorized('Invalid token payload')
    }

    return userInfo
}

export const optionalAuthenticate = (headers: Headers): null => {
    const userInfo = verifyToken(headers)
    return userInfo
}
export const requiredAuthenticate = (headers: Headers): any => {
    const userInfo = verifyToken(headers)
    if (!userInfo) throw new Unauthorized()
    return userInfo
}

const signTemp = createSigner({
    algorithm: 'HS256',
    expiresIn: '15m',
    key: process.env.JWT_SECRET,
})

export const generateTempToken = (payload: Record<string, unknown>): string => {
    return signTemp(payload)
}

export const requireRoles = (headers: Headers, roleNames: string[]): any => {
    const userInfo = requiredAuthenticate(headers)
    const { role } = userInfo
    if (!role) throw new HttpErr.Forbidden()
    if (!roleNames.includes(role)) throw new HttpErr.Forbidden()
    return userInfo
}

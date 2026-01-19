import { z } from 'zod'
export const ChatboxBody = z.object({
    userId: z.string(),
    message: z.string().toLowerCase(),
})

export type ChatboxBody = z.infer<typeof ChatboxBody>

export const ChatboxResponse = z.object({
    message: z.string(),
    suggestions: z.array(z.object({ type: z.string() })).optional(),
})

export type ChatboxResponse = z.infer<typeof ChatboxResponse>

export const OrderItem = z.object({
    name: z.string(),
    size: z.string(),
    price: z.number(),
})

export type OrderItem = z.infer<typeof OrderItem>

export const BuyMode = z.enum(['ONE', 'MANY'])
export type BuyMode = z.infer<typeof BuyMode>

export const BuyState = z.enum([
    'ASK_ITEM',
    'ASK_SIZE',
    'ASK_PRICE',
    'CONFIRM',
    'ADD_ITEM',
    'ASK_MORE',
])
export type BuyState = z.infer<typeof BuyState>

export const BuyingUsers = new Set<string>()
export type BuyingUsers = z.infer<typeof BuyingUsers>

export const BuyModeMap = new Map<string, BuyMode>()
export type BuyModeMap = z.infer<typeof BuyModeMap>

export const BuyStateMap = new Map<string, BuyState>()
export type BuyStateMap = z.infer<typeof BuyStateMap>

export const OrderOne = new Map<string, OrderItem>()
export type OrderOne = z.infer<typeof OrderOne>

export const OrderMany = new Map<string, OrderItem[]>()
export type OrderMany = z.infer<typeof OrderMany>

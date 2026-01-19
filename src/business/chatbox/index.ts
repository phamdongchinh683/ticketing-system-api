import { BuyingUsers, BuyMode, BuyModeMap, BuyState, BuyStateMap, ChatboxBody, OrderMany, OrderOne } from '../../model/body/chatbox/index.js'

export function answerMessage({ userId, message }: ChatboxBody) {
    if (BuyingUsers.has(userId)) {
        const mode = BuyModeMap.get(userId)

        if (mode === BuyMode.enum.ONE) {
            return  handleBuyOne({ userId, message })
        }

        if (mode === BuyMode.enum.MANY) {
            return  handleBuyMany({ userId, message })
        }
    }

    if (message.includes('one')) {
        BuyModeMap.set(userId, BuyMode.enum.ONE)
        startBuyOne(userId)
        return {
            message: 'Sure 😊 What item would you like to buy?',
        }
    }

    if (message.includes('many')) {
        BuyModeMap.set(userId, BuyMode.enum.MANY)
        startBuyMany(userId)
        return { message: 'Sure 😊 Enter first item (name, size, price)' }
    }

    return {
        message: "Say 'buy one' or 'buy many' to start an order 😊",
        suggestions: [{ type: 'One' }, { type: 'Many' }],
    }
}

export function startBuyOne(userId: string) {
    BuyingUsers.add(userId)
    BuyStateMap.set(userId, BuyState.enum.ASK_ITEM)
    OrderOne.set(userId, { name: '', size: '', price: 0 })
}

export function handleBuyOne({ userId, message }: ChatboxBody) {
    const state = BuyStateMap.get(userId)
    const order = OrderOne.get(userId)!

    switch (state) {
        case BuyState.enum.ASK_ITEM:
            order.name = message
            BuyStateMap.set(userId, BuyState.enum.ASK_SIZE)
            return { message: 'What size do you want?' }

        case BuyState.enum.ASK_SIZE:
            order.size = message
            BuyStateMap.set(userId, BuyState.enum.ASK_PRICE)
            return { message: 'What price are you expecting?' }

        case BuyState.enum.ASK_PRICE:
            order.price = Number(message)
            BuyStateMap.set(userId, BuyState.enum.CONFIRM)
            return {
                message: `Confirm order:
Item: ${order.name}
Size: ${order.size}
Price: ${order.price}
Type "yes" or "cancel"`,
            }

        case BuyState.enum.CONFIRM:
            if (message.toLowerCase() === 'yes') {
                clearBuyOne(userId)
                return { message: 'Order created successfully!' }
            }

            if (message.toLowerCase() === 'cancel') {
                clearBuyOne(userId)
                return { message: 'Order cancelled.' }
            }

            return { message: 'Please type "yes" or "cancel"' }
    }
}

function clearBuyOne(userId: string) {
    BuyingUsers.delete(userId)
    BuyStateMap.delete(userId)
    OrderOne.delete(userId)
}

export function startBuyMany(userId: string) {
    BuyingUsers.add(userId)
    BuyStateMap.set(userId, BuyState.enum.ADD_ITEM)
    OrderMany.set(userId, [])
}

export async function handleBuyMany({ userId, message }: ChatboxBody) {
    const state = BuyStateMap.get(userId)
    const cart = OrderMany.get(userId)!

    switch (state) {
        case BuyState.enum.ADD_ITEM: {
            const [name, size, price] = message.split(',')

            cart.push({
                name: name?.trim(),
                size: size?.trim(),
                price: Number(price),
            })

            BuyStateMap.set(userId, BuyState.enum.ASK_MORE)
            return { message: 'Item added ✅ Add another item? (yes/no)' }
        }

        case BuyState.enum.ASK_MORE:
            if (message.toLowerCase() === 'yes') {
                BuyStateMap.set(userId, BuyState.enum.ADD_ITEM)
                return { message: 'Enter next item (name, size, price)' }
            }

            BuyStateMap.set(userId, BuyState.enum.CONFIRM)
            return { message: confirmCart(cart) }

        case BuyState.enum.CONFIRM:
            if (message.toLowerCase() === 'yes') {
                clearBuyMany(userId)
                return { message: 'Order with multiple items created!' }
            }

            if (message.toLowerCase() === 'cancel') {
                clearBuyMany(userId)
                return { message: 'Order cancelled.' }
            }

            return { message: 'Type "yes" to confirm or "cancel"' }
    }
}

function confirmCart(cart: any[]) {
    let total = 0
    let text = 'Confirm your order:\n'

    cart.forEach((item, i) => {
        total += item.price || 0
        text += `${i + 1}. ${item.name} (${item.size}) - ${item.price}\n`
    })

    text += `Total: ${total}`
    return text
}

function clearBuyMany(userId: string) {
    BuyingUsers.delete(userId)
    BuyStateMap.delete(userId)
    OrderMany.delete(userId)
}


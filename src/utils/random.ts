export function generateRandomString(length: number) {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length)
}

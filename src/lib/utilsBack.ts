export function convertRfidInt(hex: string) {
    const reverseHex = hex.match(/.{1,2}/g)?.reverse().join("")
    return reverseHex ? parseInt(reverseHex, 16).toString() : "0"
}
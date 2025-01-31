import type { ServiceOption } from "./stores/ServiceStore";

export function convertRfidInt(hex: string) {
    const reverseHex = hex.match(/.{1,2}/g)?.reverse().join("")
    return reverseHex ? parseInt(reverseHex, 16).toString() : "0"
}

export function countDiscRoomAvailability(discRoomOption:{[key:string]: ServiceOption}, library:string):number {
    let currentCount:number = 0;
    for (const subset of Object.values(discRoomOption)) {
        if ((library == 'engglib2' && subset.options.length == 10) ||
            (library == 'engglib1' && 
            (((subset.label == 'Ergonomics DR' || subset.label == 'Kinematics DR') && subset.options.length == 8) ||
            ((subset.label != 'Ergonomics DR' && subset.label != 'Kinematics DR') && subset.options.length == 6)))
        ) {
            currentCount++;
        }
    }
    return currentCount;
}
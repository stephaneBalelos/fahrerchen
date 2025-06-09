export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const arrayFillWithNullValues = <T>(array: T[], length: number) => {
    const newArray : T[] = [...array]
    if (newArray.length >= length) {
        return newArray
    }
    for (let i = newArray.length; i < length; i++) {
        newArray.push(null as unknown as T)
    }
    return newArray
}
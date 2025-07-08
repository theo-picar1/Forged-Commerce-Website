// ********** Stuff like capitilising a string, formatting a string or whatever ********** //

// Capitilise the first letter of the passed in string, the return it
export function capitiliseString(string: string): string {
    return string.substring(0, 1).toUpperCase() + string.substring(1)
}

// To add the corresponding suffix bit to a day depending on what day it is i.e 1 = 1st
function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
    }
}

// Function to return a Date object into a format like 14th January, 2025 
export function formatDate(dateString: Date): string {
    const date = new Date(dateString)
    const day = date.getDate()
    const suffix = getOrdinalSuffix(day)

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    return `${day}${suffix} ${month}, ${year}`
}
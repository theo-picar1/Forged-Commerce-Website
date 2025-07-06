// ********** Stuff like capitilising a string, formatting a string or whatever ********** //

// Capitilise the first letter of the passed in string, the return it
export function capitiliseString(string: string): string {
    return string.substring(0, 1).toUpperCase() + string.substring(1)
}
// ********** Holds all functions relating to validtions **********

// Validating email format
export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validating if password is at least 8 characters long
export const validatePassword = (password: string): boolean => {
    return password.length >= 8
}

// Validate if name is > and <= 30 and only contains letters
export const validateFirstName = (name: string) => {
    return name.length <= 30 && name.length > 0 && /^[A-Za-z]+$/.test(name)
}

// Same with above but max limit is 40
export const validateLastName = (name: string) => {
    return name.length <= 40 && name.length > 0 && /^[A-Za-z]+$/.test(name)
}

// Validation for irish telephone numbers
export const validatePhone = (telephoneNo: string) => {
    return /^(?:\+353|0)8[3-9]\d{7}$/.test(telephoneNo)
}

// Validation for irish eircodes
export const validateEircode = (eircode: string) => {
    return /^[A-Za-z]\d{2}\s?[A-Za-z0-9]{4}$/.test(eircode.trim())
}

// Validation to see if passwords match
export const validateConfirmPassword = (confirm: string, password: string) => {
    return confirm === password
}
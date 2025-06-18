import React, { useState } from "react"
import { Link, Redirect, useHistory } from "react-router-dom"
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_GUEST, ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants.ts"

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [telephoneNo, setTelephoneNo] = useState("")
    const [houseAddress, setHouseAddress] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isRegistered, setIsRegistered] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [invalidFirst, setInvalidFirst] = useState(false)
    const [invalidLast, setInvalidLast] = useState(false)
    const [invalidPhone, setInvalidPhone] = useState(false)
    const [invalidAddress, setInvalidAddress] = useState(false)
    const [invalidConfirm, setInvalidConfirm] = useState(false)
    const [firstNameError, setFirstNameError] = useState("")
    const [secondNameError, setSecondNameError] = useState("")
    const [emailErrorMessage, setEmailErrorMessage] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        switch (name) {
            case "firstName": setFirstName(value); break
            case "lastName": setLastName(value); break
            case "email": setEmail(value); break
            case "telephoneNo": setTelephoneNo(value); break
            case "houseAddress": setHouseAddress(value); break
            case "password": setPassword(value); break
            case "confirmPassword": setConfirmPassword(value); break
        }
    }

    const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!validInputs()) return

        const inputs = {
            firstName,
            lastName,
            email,
            telephoneNo,
            houseAddress,
            password,
            accessLevel: ACCESS_LEVEL_NORMAL_USER
        }

        try {
            const res = await axios.post(`${SERVER_HOST}/users/register`, inputs)
            if (res.data?.errorMessage) {
                setEmailErrorMessage(res.data.errorMessage)
                setInvalidEmail(true)
            }
            else if (res.data) {
                setIsRegistered(true)
            }
            else {
                alert("Registration failed")
            }
        }
        catch (error: any) {
            if (error.response?.data?.errorMessage) {
                setEmailErrorMessage(error.response.data.errorMessage)
                setInvalidEmail(true)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    const validInputs = () => {
        const invalidEmail = !validateEmail()
        const invalidPassword = !validatePassword()
        const invalidPhone = !validatePhone()
        const invalidAddress = !validateEircode()
        const invalidFirst = !validateFirstName()
        const invalidLast = !validateLastName()
        const invalidConfirm = !validateConfirmPassword()

        setInvalidEmail(invalidEmail)
        setInvalidPassword(invalidPassword)
        setInvalidPhone(invalidPhone)
        setInvalidAddress(invalidAddress)
        setInvalidFirst(invalidFirst)
        setInvalidLast(invalidLast)
        setInvalidConfirm(invalidConfirm)

        return !(
            invalidEmail ||
            invalidPassword ||
            invalidPhone ||
            invalidAddress ||
            invalidFirst ||
            invalidLast ||
            invalidConfirm
        )
    }

    const validateEmail = () => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!valid) setEmailErrorMessage("Invalid email")
        return valid
    }

    const validatePassword = () => password.length >= 8

    const validateFirstName = () => {
        if (firstName.length >= 30) {
            setFirstNameError("Name must be less than 30 characters")
            return false
        }
        if (firstName.length <= 0 || !/^[A-Za-z]+$/.test(firstName)) {
            setFirstNameError("Invalid name")
            return false
        }
        return true
    }

    const validateLastName = () => {
        if (lastName.length >= 40) {
            setSecondNameError("Name must be less than 40 characters")
            return false
        }
        if (lastName.length <= 0 || !/^[A-Za-z]+$/.test(lastName)) {
            setSecondNameError("Invalid name")
            return false
        }
        return true
    }

    const validatePhone = () => /^(?:\+353|0)8[3-9]\d{7}$/.test(telephoneNo)
    const validateEircode = () => /^[A-Za-z]\d{2}\s?[A-Za-z0-9]{4}$/.test(houseAddress.trim())
    const validateConfirmPassword = () => confirmPassword === password

    const changeStyle = (invalid: boolean) => ({ borderColor: invalid ? '#FE0404' : '#808080' })
    const showMessage = (invalid: boolean) => ({ display: invalid ? 'block' : 'none' })

    if (isRegistered) return <Redirect to="/" />

    return (
        <div className="authentication-page-container">
            <Link to="/" className="title">
                <img src="/images/app-logo.png" alt="" />
                <h1>FORGED</h1>
            </Link>

            <form className="authentication-content">
                <h3>Create account</h3>
                <div className="inputs-container">
                    {/* Repeat each field like you had it */}
                    {/* Just replace value + onChange logic with the corresponding hook/state */}
                    {/* For brevity, you can copy from the original render method */}
                    {/* Example below for first name */}
                    <div className="input-row-section">
                        <div className="input-section">
                            <p>First name</p>
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidFirst)}
                                    autoComplete="off"
                                />
                                <p className="error-message" style={showMessage(invalidFirst)}>{firstNameError}</p>
                            </div>
                        </div>

                        <div className="input-section">
                            <p>Last name</p>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidLast)}
                                    autoComplete="off"
                                />
                                <p className="error-message" style={showMessage(invalidLast)}>{secondNameError}</p>
                            </div>
                        </div>
                    </div>

                    <div className="input-section">
                        <p>Email</p>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                                className="input-field"
                                style={changeStyle(invalidEmail)}
                                autoComplete="off"
                            />
                            <p className="error-message" style={showMessage(invalidEmail)}>{emailErrorMessage}</p>
                        </div>
                    </div>

                    <div className="input-section">
                        <p>Phone number</p>
                        <div>
                            <input
                                type="text"
                                name="telephoneNo"
                                value={telephoneNo}
                                onChange={handleInputChange}
                                className="input-field"
                                style={changeStyle(invalidPhone)}
                                autoComplete="off"
                            />
                            <p className="error-message" style={showMessage(invalidPhone)}>Invalid Irish phone number</p>
                        </div>
                    </div>

                    <div className="input-section">
                        <p>Address (Eircode)</p>
                        <div>
                            <input
                                type="text"
                                name="houseAddress"
                                value={houseAddress}
                                onChange={handleInputChange}
                                className="input-field"
                                style={changeStyle(invalidAddress)}
                                autoComplete="off"
                            />
                            <p className="error-message" style={showMessage(invalidAddress)}>Invalid Eircode format</p>
                        </div>
                    </div>

                    <div className="input-row-section">
                        <div className="input-section">
                            <p>Password</p>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidPassword)}
                                    autoComplete="off"
                                />
                                <p className="error-message" style={showMessage(invalidPassword)}>Minimum 8 characters</p>
                            </div>
                        </div>

                        <div className="input-section">
                            <p>Confirm Password</p>
                            <div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidConfirm)}
                                    autoComplete="off"
                                />
                                <p className="error-message" style={showMessage(invalidConfirm)}>Passwords do not match</p>
                            </div>
                        </div>
                    </div>

                    {/* Continue rest of form inputs the same way... */}
                    <button className="submit-button" onClick={submitForm}>Create account</button>
                </div>

                <div className="bottom-section register-bottom-section">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Register

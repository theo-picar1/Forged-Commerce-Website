import React, { Component } from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants.ts"

type RegisterProps = RouteComponentProps

// IMPORTANT: houseAddress is actually eircode. I am jusst too lazy to change the variable

// Separating this because handleInputChange complains if a field has a value type that is not a string
type RegisterInputState = {
    firstName: string
    lastName: string
    email: string
    telephoneNo: string
    houseAddress: string
    password: string
    confirmPassword: string
}

type RegisterState = RegisterInputState & {
    allFieldsFilled: boolean
    accessLevel: Number
    isRegistered: boolean
    invalidEmail: boolean
    invalidPassword: boolean
    invalidFirst: boolean
    invalidLast: boolean
    invalidAddress: boolean
    invalidPhone: boolean
    invalidConfirm: boolean
    firstNameError: string
    secondNameError: string
    emailErrorMessage: string
}

export default class Register extends Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            telephoneNo: "",
            houseAddress: "",
            password: "",
            confirmPassword: "",
            allFieldsFilled: false,
            accessLevel: ACCESS_LEVEL_GUEST,
            isRegistered: false,
            invalidEmail: false,
            invalidPassword: false,
            invalidFirst: false,
            invalidLast: false,
            invalidAddress: false,
            invalidPhone: false,
            invalidConfirm: false,
            firstNameError: "",
            secondNameError: "",
            emailErrorMessage: ""
        }
    }

    // Handles all changes done to the input fields
    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.name as keyof RegisterInputState
        const value = e.currentTarget.value // This is why allFieldsFilled field needs to be separate as this always expects a string

        if (key in this.state) {
            this.setState({ [key]: value } as Pick<RegisterInputState, keyof RegisterInputState>) // Take changing email for example. It's only picking the email field from RegisterINputState and changing that only
        }
    }

    // Submits form with all values of the input saved in this.state
    submitForm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        if (!this.validInputs()) {
            return
        }

        const inputs = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            telephoneNo: this.state.telephoneNo,
            houseAddress: this.state.houseAddress,
            password: this.state.password,
            accessLevel: ACCESS_LEVEL_NORMAL_USER
        }

        try {
            // Call the corresponding method to register and hopefully add the new user to the database
            const res = await axios.post(`${SERVER_HOST}/users/register`, inputs)
            if (res.data.errorMessage) {
                console.log(res.data.errorMessage)
            }
            else if (res.data) {
                console.log("User registered")

                this.setState({
                    isRegistered: true
                })
            }
            else {
                console.log("Registration failed")
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
                this.setState({
                    emailErrorMessage: error.response.data.errorMessage,
                    invalidEmail: true
                })
            } 
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    validInputs = (): boolean => {
        const results = {
            invalidEmail: !this.validateEmail(),
            invalidPassword: !this.validatePassword(),
            invalidPhone: !this.validatePhone(),
            invalidAddress: !this.validateEircode(),
            invalidFirst: !this.validateFirstName(),
            invalidLast: !this.validateLastName(),
            invalidConfirm: !this.validateConfirmPassword()
        }

        this.setState(results)

        // All result fields must be false (not invalid) in order to return true
        return Object.values(results).every(invalid => !invalid)
    }

    // This regular expression checks for a basic valid email format:
    // ^           -> start of the string
    // [^\s@]+     -> one or more characters that are not whitespace or '@'
    // @           -> the '@' symbol
    // [^\s@]+     -> one or more characters that are not whitespace or '@' (domain name)
    // \.          -> a literal dot '.'
    // [^\s@]+     -> one or more characters that are not whitespace or '@' (top-level domain)
    // $           -> end of the string
    // All validate email should return true if passed value is valid
    validateEmail = (): boolean => {
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
            this.setState({
                emailErrorMessage: "Invalid email"
            })

            return false
        }

        return true
    }

    validatePassword = (): boolean => {
        return this.state.password.length >= 8
    }

    validateFirstName = (): boolean => {
        // Custom error message depending on which if statement is targeted first below
        if (this.state.firstName.length >= 30) {
            this.setState({
                firstNameError: "Name must be less than 30 characters"
            })

            return false
        }
        else if (this.state.firstName.length <= 0 || !/^[A-Za-z]+$/.test(this.state.firstName)) {
            this.setState({
                firstNameError: "Invalid name"
            })

            return false
        }

        return true
    }

    validateLastName = (): boolean => {
        // Same thing
        if (this.state.lastName.length >= 40) {
            this.setState({
                secondNameError: "Name must be less than 40 characters"
            })

            return false
        }
        else if (this.state.lastName.length <= 0 || !/^[A-Za-z]+$/.test(this.state.lastName)) {
            this.setState({
                secondNameError: "Invalid name"
            })

            return false
        }

        return true
    }

    validatePhone = (): boolean => {
        const regex = /^(?:\+353|0)8[3-9]\d{7}$/
        return regex.test(this.state.telephoneNo)
    }

    validateEircode = (): boolean => {
        const regex = /^[A-Za-z]\d{2}\s?[A-Za-z0-9]{4}$/
        return regex.test(this.state.houseAddress.trim())
    }

    validateConfirmPassword = (): boolean => {
        return this.state.confirmPassword == this.state.password
    }

    // Helper function so that I don't need to constantly type out the below stuff
    changeStyle = (invalid: boolean) => ({
        borderColor: invalid ? '#FE0404' : '#808080'
    })

    // Same reason for above but for the error message 
    showMessage = (invalid: boolean) => ({
        display: invalid ? 'block' : 'none'
    })

    render() {
        const {
            isRegistered,
            invalidEmail,
            invalidPassword,
            invalidFirst,
            invalidLast,
            invalidPhone,
            invalidAddress,
            invalidConfirm,
            firstNameError,
            secondNameError,
            emailErrorMessage
        } = this.state

        return (
            isRegistered ? (
                <Redirect to={"/"} />
            ) : (
                <div className="authentication-page-container">
                    <Link to={"/"} className="title">
                        <img src="/images/app-logo.png" alt="" />

                        <h1>FORGED</h1>
                    </Link >

                    <form className="authentication-content">
                        <h3>Create account</h3>

                        <div className="inputs-container">
                            <div className="input-row-section">
                                <div className="input-section">
                                    <p>First name</p>

                                    <div>
                                        <input
                                            type="text"
                                            onChange={(e) => this.handleInputChange(e)}
                                            className="input-field"
                                            name="firstName"
                                            style={this.changeStyle(invalidFirst)}
                                            autoComplete="off"
                                        />

                                        <p className="error-message" style={this.showMessage(invalidFirst)}>{firstNameError}</p>
                                    </div>
                                </div>

                                <div className="input-section">
                                    <p>Last name</p>

                                    <div>
                                        <input
                                            type="text"
                                            className="input-field"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name="lastName"
                                            style={this.changeStyle(invalidLast)}
                                            autoComplete="off"
                                        />

                                        <p className="error-message" style={this.showMessage(invalidLast)}>{secondNameError}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="input-section">
                                <p>Email</p>

                                <div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        onChange={(e) => this.handleInputChange(e)}
                                        name="email"
                                        style={this.changeStyle(invalidEmail)}
                                    />

                                    <p className="error-message" style={this.showMessage(invalidEmail)}>{emailErrorMessage}</p>
                                </div>
                            </div>

                            <div className="input-section">
                                <p>Telephone no.</p>

                                <div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        onChange={(e) => this.handleInputChange(e)}
                                        name="telephoneNo"
                                        style={this.changeStyle(invalidPhone)}
                                        autoComplete="tel"
                                    />

                                    <p className="error-message" style={this.showMessage(invalidPhone)}>Irish phone numbers only</p>
                                </div>
                            </div>

                            <div className="input-section">
                                <p>Eircode</p>

                                <div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        onChange={(e) => this.handleInputChange(e)}
                                        name="houseAddress"
                                        style={this.changeStyle(invalidAddress)}
                                        autoComplete="postal-code"
                                    />

                                    <p className="error-message" style={this.showMessage(invalidAddress)}>Irish eircodes only</p>
                                </div>
                            </div>

                            <div className="input-row-section">
                                <div className="input-section">
                                    <p>Password</p>

                                    <div>
                                        <input
                                            type="password"
                                            className="input-field"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name="password"
                                            style={this.changeStyle(invalidPassword)}
                                            placeholder="8 characters minimum"
                                            autoComplete="new-password"
                                        />

                                        <p className="error-message" style={this.showMessage(invalidPassword)}>Invalid password</p>
                                    </div>
                                </div>

                                <div className="input-section">
                                    <p>Confirm password</p>

                                    <div>
                                        <input
                                            type="password"
                                            className="input-field"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name="confirmPassword"
                                            style={this.changeStyle(invalidConfirm)}
                                            autoComplete="new-password"
                                        />

                                        <p className="error-message" style={this.showMessage(invalidConfirm)}>Passwords do not match</p>
                                    </div>
                                </div>
                            </div>

                            <button className="submit-button" onClick={(e) => this.submitForm(e)}>Create account</button>
                        </div>

                        <div className="bottom-section register-bottom-section">
                            <p>Already have an account? <Link to={"/login"}>Sign in</Link></p>
                        </div>
                    </form>
                </div>
            )
        )
    }
}

import React, { Component } from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"
import { ACCESS_LEVEL_GUEST } from "../config/global_constants.ts"

type LoginProps = RouteComponentProps

type LoginInputState = {
    email: string
    password: string
}

type LoginState = LoginInputState & {
    allFieldsFilled: boolean
    accessLevel: Number
    isLoggedIn: boolean
    invalidEmail: boolean
    invalidPassword: boolean
    emailErrorMessage: string
    firstName: string
}

export default class Login extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props)

        this.state = {
            email: "",
            password: "",
            allFieldsFilled: false,
            accessLevel: ACCESS_LEVEL_GUEST,
            isLoggedIn: false,
            invalidEmail: false,
            invalidPassword: false,
            emailErrorMessage: "",
            firstName: ""
        }
    }

    // Handles all changes done to the input fields
    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.name as keyof LoginInputState
        const value = e.currentTarget.value

        if (key in this.state) {
            this.setState({ [key]: value } as Pick<LoginInputState, keyof LoginInputState>) // Take changing email for example. It's only picking the email field from LoginInputState and changing that only
        }
    }

    validateEmail = (): boolean => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
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

    validateInputs = () => {
        const results = {
            invalidEmail: !this.validateEmail(), // valid email means ! invalid email
            invalidPassword: !this.validatePassword()
        }

        this.setState(results)

        // All result fields must be false (not invalid) in order to return true
        return Object.values(results).every(invalid => !invalid)
    }

    // Submits form with all values of the input saved in this.state
    submitForm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        if (!this.validateInputs()) return

        const inputs = {
            email: this.state.email,
            password: this.state.password
        }

        try {
            // Call the corresponding method to login and hopefully add the new user to the database
            const res = await axios.post(`${SERVER_HOST}/users/login`, inputs)
            if (res.data.errorMessage) {
                return
            }
            else if (res.data) {
                localStorage.accessLevel = res.data.accessLevel

                this.setState({
                    isLoggedIn: true,
                    firstName: res.data.firstName
                })
            }
            else {
                alert("Registration failed")
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
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

    // Helper function so that I don't need to constantly type out the below stuff
    changeStyle = (invalid: boolean) => ({
        borderColor: invalid ? '#FE0404' : '#808080'
    })

    // Same reason for above but for the error message 
    showMessage = (invalid: boolean) => ({
        display: invalid ? 'block' : 'none'
    })

    render() {
        const { isLoggedIn, invalidEmail, invalidPassword, emailErrorMessage, firstName } = this.state

        return (
            <div className="authentication-page-container">
                <Link to={"/"} className="title">
                    <img src="/images/app-logo.png" alt="" />

                    <h1>FORGED</h1>
                </Link>

                {isLoggedIn ? (
                    <div className="authentication-content">
                        <p style={{ textAlign: "center", fontWeight: "bold" }}>Welcome back { firstName }!</p>

                        <div className="inputs-container">
                            <Link to={"/"} className="submit-button link-button">Proceed to Forged</Link>
                        </div>
                    </div>
                ) : (
                    <form className="authentication-content">
                        <h3>Sign Up</h3>

                        <div className="inputs-container">
                            <div className="input-section">
                                <p>Email</p>

                                <div>
                                    <input
                                        type="text"
                                        name="email"
                                        onChange={(e) => this.handleInputChange(e)}
                                        style={this.changeStyle(invalidEmail)}
                                        autoComplete="email"
                                    />

                                    <p className="error-message" style={this.showMessage(invalidEmail)}>{emailErrorMessage}</p>
                                </div>
                            </div>

                            <div className="input-section">
                                <div className="forgot-password">
                                    <p>Password</p>

                                    <Link to={"/forgot-password"} className="prompt">Forgot password?</Link>
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={(e) => this.handleInputChange(e)}
                                        style={this.changeStyle(invalidPassword)}
                                    />

                                    <p className="error-message" style={this.showMessage(invalidPassword)}>Invalid password</p>
                                </div>
                            </div>

                            <button className="submit-button" onClick={(e) => this.submitForm(e)}>Sign in</button>
                        </div>

                        <div className="bottom-section">
                            <div className="message">
                                <hr />

                                <p>New to Forged?</p>

                                <hr />
                            </div>

                            <Link to={"/register"} className="create-account-button">Create an account</Link>
                        </div>
                    </form>
                )}
            </div>
        )
    }
}
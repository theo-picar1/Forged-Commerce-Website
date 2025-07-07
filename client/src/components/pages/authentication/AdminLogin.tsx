import React, { useState } from "react"
import { Link } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST } from "../../../config/global_constants"

const AdminLogin: React.FC = () => {
    // State variables
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("")

    // Handling all changes done to the input fields for Login component
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.currentTarget

        if (name === "email") {
            setEmail(value)
        }
        else if (name === "password") {
            setPassword(value)
        }
    }

    // Validating email. Return true if valid and false if invalid
    const validateEmail = (): boolean => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailErrorMessage("Invalid email")
            return false
        }
        return true
    }

    // Same logic
    const validatePassword = (): boolean => {
        return password.length >= 8
    }

    // Called before sending to axios. All invalid fields have to be false in order to proceed
    const validInputs = (): boolean => {
        const invalidEmailResult = !validateEmail()
        const invalidPasswordResult = !validatePassword()

        setInvalidEmail(invalidEmailResult)
        setInvalidPassword(invalidPasswordResult)

        // All result fields must be false (not invalid) in order to return true
        return !(invalidEmailResult || invalidPasswordResult)
    }

    // Submit form handler
    const submitForm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        // Check comment for function 'validInputs'
        if (!validInputs()) return

        const inputs = {
            email,
            password
        }

        try {
            const res = await axios.post(`${SERVER_HOST}/users/admin/login`, inputs)

            // Let guy know if know if no data was sent back or if data sent back was an errorMessage
            if (!res || res.data.errorMessage) {
                alert(res.data.errorMessage)
            }
            // Otherwise, set admin access levels and admin id for user
            else {
                localStorage.accessLevel = res.data.accessLevel
                localStorage.id = res.data.id
                setIsLoggedIn(true)
            }
        }
        // Most likely a server error if this else block is targeted
        catch (error: any) {
            // See if it was one of the custom erros set
            if (error.response.data.errorMessage) {
                setEmailErrorMessage(error.response.data.errorMessage)
                setInvalidEmail(true)
            }
            // Otherwise, it is an unexepected error need fixing
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    // Helper function to conditionally set input border color
    const changeStyle = (invalid: boolean) => ({
        borderColor: invalid ? "#FE0404" : "#808080"
    })

    // Helper function to conditionally show error messages
    const showMessage = (invalid: boolean) => ({
        display: invalid ? "block" : "none"
    })

    return (
        <div className="authentication-page-container">
            <Link to={"/"} className="title">
                <img src="/images/app-logo.png" alt="" />

                <h1>FORGED</h1>
            </Link>

            {isLoggedIn ? (
                <div className="authentication-content">
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>Welcome back Administrator!</p>

                    <div className="inputs-container">
                        <Link to={"/"} className="submit-button link-button">
                            Proceed to Forged
                        </Link>
                    </div>
                </div>
            ) : (
                <form className="authentication-content">
                    <div className="top-section">
                        <h3>Admin Login</h3>

                        <Link to={"/login"} className="link">User login</Link>
                    </div>

                    <div className="inputs-container">
                        <div className="input-section">
                            <p>Email</p>

                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    onChange={handleInputChange}
                                    style={changeStyle(invalidEmail)}
                                    autoComplete="email"
                                    value={email}
                                />
                                <p className="error-message" style={showMessage(invalidEmail)}>
                                    {emailErrorMessage}
                                </p>
                            </div>
                        </div>

                        <div className="input-section">
                            <div className="forgot-password">
                                <p>Password</p>
                                <Link to={"/forgot-password"} className="prompt">
                                    Forgot password?
                                </Link>
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    style={changeStyle(invalidPassword)}
                                    value={password}
                                />
                                <p className="error-message" style={showMessage(invalidPassword)}>
                                    Invalid password
                                </p>
                            </div>
                        </div>

                        <button className="submit-button" onClick={submitForm}>
                            Sign in
                        </button>
                    </div>

                    <div className="bottom-section">
                        <div className="message">
                            <hr />
                            <p>New to Forged?</p>
                            <hr />
                        </div>

                        <Link to={"/register"} className="create-account-button">
                            Create an account
                        </Link>
                    </div>
                </form>
            )}
        </div>
    )
}

export default AdminLogin
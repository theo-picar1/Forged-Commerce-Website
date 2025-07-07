import React, { useReducer, useState } from "react"
import { Link } from "react-router-dom"

// axios
import { SERVER_HOST } from "../../../config/global_constants.ts"
import axios from "axios"

// functions 
import { validateEmail, validatePassword } from "../../../utils/validation-utils.ts"
import { changeStyle, showMessage } from "../../../utils/dom-utils.ts"

// Define state variables for useReducer
type FormState = {
    email: string
    password: string
}

// useReducer actions
type FormAction = | { type: 'UPDATE_FIELD'; field: keyof FormState; value: string | number } | { type: 'RESET_FORM' }

// component
const Login: React.FC = () => {
    // Initial state variables
    const initialState: FormState = {
        email: '',
        password: ''
    }

    // Standard useState variables
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')

    // Handle updates or resets to the state variables
    const formReducer = (state: FormState, action: FormAction): FormState => {
        switch (action.type) {
            // Update field that user is typing in
            case 'UPDATE_FIELD':
                return {
                    ...state,
                    [action.field]: action.value
                }
            // Reset to intiial values
            case 'RESET_FORM':
                return initialState
            default:
                return state
        }
    }

    // To be able to use it, where state is the field and dispatch is the action
    const [state, dispatch] = useReducer(formReducer, initialState)

    // Handling all changes done to the input fields for Login component
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target

        // Update state based on e.target.name
        dispatch({
            type: 'UPDATE_FIELD',
            field: name as keyof FormState,
            value: value
        })
    }

    // Called before sending to axios. All invalid fields have to be false (not invalid) in order to proceed
    const validInputs = (): boolean => {
        const invalidEmailResult = !validateEmail(state.email)
        const invalidPasswordResult = !validatePassword(state.password)

        if (invalidEmailResult) {
            setInvalidEmail(invalidEmailResult)
            setEmailErrorMessage("Invalid email format")
        }
        if (invalidPassword) {
            setInvalidPassword(invalidPasswordResult)
        }

        // All result fields must be false (not invalid) in order to return true
        return !(invalidEmailResult || invalidPasswordResult)
    }

    // Submit form handler
    const submitForm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        // Check comment for function 'validInputs'
        if (!validInputs()) return

        const inputs = {
            email: state.email,
            password: state.password
        }

        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, inputs)
            if (res.data.errorMessage) {
                return
            }
            else {
                localStorage.accessLevel = res.data.accessLevel
                localStorage.id = res.data.id

                setIsLoggedIn(true)
                setFirstName(res.data.firstName)
            }
        }
        catch (error: any) {
            const errorMessage = error.response.data.errorMessage

            // Highlight incorrect input and show error message sent from backend
            if (errorMessage && errorMessage.includes("email")) {
                setEmailErrorMessage(error.response.data.errorMessage)
                setInvalidEmail(true)
            }
            else if (errorMessage && errorMessage.includes("password")) {
                setInvalidPassword(true)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    return (
        <div className="authentication-page-container">
            <Link to={"/"} className="title">
                <img src="/images/app-logo.png" alt="" />

                <h1>FORGED</h1>
            </Link>

            {isLoggedIn ? (
                <div className="authentication-content">
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>Welcome back {firstName}!</p>

                    <div className="inputs-container">
                        <Link to={"/"} className="submit-button link-button">
                            Proceed to Forged
                        </Link>
                    </div>
                </div>
            ) : (
                <form className="authentication-content">
                    <div className="top-section">
                        <h3>Sign in</h3>

                        <Link className="link" to={"/admin-login"}>Admin login</Link>
                    </div>

                    <div className="inputs-container">
                        <div className="input-section">
                            <p>email</p>

                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    onChange={handleInputChange}
                                    style={changeStyle(invalidEmail)}
                                    autoComplete="email"
                                    value={state.email}
                                />
                                <p className="error-message" style={showMessage(invalidEmail)}>
                                    {emailErrorMessage}
                                </p>
                            </div>
                        </div>

                        <div className="input-section">
                            <div className="forgot-password">
                                <p>password</p>
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
                                    value={state.password}
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

export default Login
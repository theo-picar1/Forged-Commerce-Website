import React, { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_NORMAL_USER } from "../../../config/global_constants.ts"

// functions 
import { changeStyle, showMessage } from "../../../utils/dom-utils.ts"
import { validateEmail, validatePassword, validateFirstName, validateLastName, validateConfirmPassword, validateEircode, validatePhone } from "../../../utils/validation-utils.ts"

// Form state variables
type FormState = {
    firstName: string
    lastName: string
    email: string
    telephoneNo: string
    houseAddress: string
    password: string
    confirmPassword: string
}

// Defines updates for this form. UPDATE_FIELD is the same as 'setSomething', RESET_FORM just resets fields to intial values
type FormAction = | { type: 'UPDATE_FIELD'; field: keyof FormState; value: string | number } | { type: 'RESET_FORM' }

const Register: React.FC = () => {
    // Initial form state variables
    const initialState: FormState = {
        firstName: "",
        lastName: "",
        email: "",
        telephoneNo: "",
        houseAddress: "",
        password: "",
        confirmPassword: ''
    }

    // useState variables
    const [isRegistered, setIsRegistered] = useState<boolean>(false)
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
    const [invalidFirst, setInvalidFirst] = useState<boolean>(false)
    const [invalidLast, setInvalidLast] = useState<boolean>(false)
    const [invalidPhone, setInvalidPhone] = useState<boolean>(false)
    const [invalidAddress, setInvalidAddress] = useState<boolean>(false)
    const [invalidConfirm, setInvalidConfirm] = useState<boolean>(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("")

    // Navigation
    const navigate = useNavigate()

    // For handling all state variables defined in FormState. 
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

    // Handle all input chnges in form with useReducer
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Update state variable based on name
        dispatch({ 
            type: 'UPDATE_FIELD', 
            field: name as keyof FormState, 
            value: value 
        })
    }

    // Validate all inputs and submit form
    const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!validInputs()) return

        const inputs = {
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            telephoneNo: state.telephoneNo,
            houseAddress: state.houseAddress,
            password: state.password,
            accessLevel: ACCESS_LEVEL_NORMAL_USER
        }

        try {
            const res = await axios.post(`${SERVER_HOST}/users/register`, inputs)
            if (res.data?.errorMessage) {
                return
            }
            else if (res.data) {
                setIsRegistered(true)
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    const validInputs = () => {
        const invalidEmail = !validateEmail(state.email)
        const invalidPassword = !validatePassword(state.password)
        const invalidPhone = !validatePhone(state.telephoneNo)
        const invalidAddress = !validateEircode(state.houseAddress)
        const invalidFirst = !validateFirstName(state.firstName)
        const invalidLast = !validateLastName(state.lastName)
        const invalidConfirm = !validateConfirmPassword(state.confirmPassword, state.password)

        if(invalidEmail) {
            setEmailErrorMessage("Invalid email format")
        }

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

    if (isRegistered) navigate("/")

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
                                    value={state.firstName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidFirst)}
                                    autoComplete="off"
                                    placeholder="30 character max"
                                />
                                <p className="error-message" style={showMessage(invalidFirst)}>Invalid name</p>
                            </div>
                        </div>

                        <div className="input-section">
                            <p>Last name</p>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={state.lastName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    style={changeStyle(invalidLast)}
                                    autoComplete="off"
                                    placeholder="40 characters max"
                                />
                                <p className="error-message" style={showMessage(invalidLast)}>Invalid surname</p>
                            </div>
                        </div>
                    </div>

                    <div className="input-section">
                        <p>Email</p>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={state.email}
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
                                value={state.telephoneNo}
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
                                value={state.houseAddress}
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
                                    value={state.password}
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
                                    value={state.confirmPassword}
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

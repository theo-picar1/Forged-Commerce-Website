import React, { Component } from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants.ts"

type RegisterProps = RouteComponentProps

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
            isRegistered: false
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
        catch (error) {
            console.error("Error during registration:", error)
        }
    }

    render() {
        const { isRegistered } = this.state
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

                                    <input type="text" onChange={(e) => this.handleInputChange(e)} className="input-field" name="firstName" />
                                </div>

                                <div className="input-section">
                                    <p>Last name</p>

                                    <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} name="lastName" />
                                </div>
                            </div>

                            <div className="input-section">
                                <p>Email</p>

                                <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} name="email" />
                            </div>

                            <div className="input-section">
                                <p>Telephone no.</p>

                                <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} name="telephoneNo" />
                            </div>

                            <div className="input-section">
                                <p>House address.</p>

                                <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} name="houseAddress" />
                            </div>

                            <div className="input-row-section">
                                <div className="input-section">
                                    <p>Password</p>

                                    <input type="password" className="input-field" onChange={(e) => this.handleInputChange(e)} name="password" />
                                </div>

                                <div className="input-section">
                                    <p>Confirm password</p>

                                    <input type="password" className="input-field" onChange={(e) => this.handleInputChange(e)} name="confirmPassword" />
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

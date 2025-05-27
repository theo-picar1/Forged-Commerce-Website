import React, { Component } from "react"
import { Link, RouteComponentProps } from "react-router-dom"

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
            allFieldsFilled: false
        }
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.name as keyof RegisterInputState
        const value = e.currentTarget.value // This is why allFieldsFilled field needs to be separate as this always expects a string

        if (key in this.state) {
            this.setState({ [key]: value } as Pick<RegisterInputState, keyof RegisterInputState>) // Take changing email for example. It's only picking the email field from RegisterINputState and changing that only
        }
    }

    highlightInvalidFields = (): void => {
        const inputs = document.querySelectorAll<HTMLInputElement>(".input-field")
        let invalid: boolean = false

        inputs.forEach(input => {
            // Highlight all the inputs with empty values with a red border
            if(input.value === "" || input.value === undefined) {
                input.style.border = "thin solid red"
                invalid = true
            }
            else {
                input.style.border = "thin solid #808080"
            }
        })

        if(!invalid) {
            this.submitForm()
        }
    }

    submitForm = (): void => {

    }

    render() {
        return (
            <div className="authentication-page-container">
                <Link to={"/"} className="title">
                    <img src="/images/app-logo.png" alt="" />

                    <h1>FORGED</h1>
                </Link>

                <form className="authentication-content">
                    <h3>Create account</h3>

                    <div className="inputs-container">
                        <div className="input-row-section">
                            <div className="input-section">
                                <p>First name</p>

                                <input type="text" onChange={(e) => this.handleInputChange(e)} className="input-field"/>
                            </div>

                            <div className="input-section">
                                <p>Last name</p>

                                <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                            </div>
                        </div>

                        <div className="input-section">
                            <p>Email</p>

                            <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                        </div>

                        <div className="input-section">
                            <p>Telephone no.</p>

                            <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                        </div>

                        <div className="input-section">
                            <p>House address.</p>

                            <input type="text" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                        </div>

                        <div className="input-row-section">
                            <div className="input-section">
                                <p>Password</p>

                                <input type="password" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                            </div>

                            <div className="input-section">
                                <p>Confirm password</p>

                                <input type="password" className="input-field" onChange={(e) => this.handleInputChange(e)} />
                            </div>
                        </div>

                        <button className="submit-button" onClick={() => this.highlightInvalidFields()}>Create account</button>
                    </div>

                    <div className="bottom-section register-bottom-section">
                        <p>Already have an account? <Link to={"/login"}>Sign in</Link></p>
                    </div>
                </form>
            </div>
        )
    }
}
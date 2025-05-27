import React, { Component } from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants.ts"

type LoginProps = RouteComponentProps

type LoginInputState = {
    email: string
    password: string
}

type LoginState = LoginInputState & {
    allFieldsFilled: boolean
    accessLevel: Number
    isLoggedIn: boolean
}

export default class Login extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props)

        this.state = {
            email: "",
            password: "",
            allFieldsFilled: false,
            accessLevel: ACCESS_LEVEL_GUEST,
            isLoggedIn: false
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

    // Submits form with all values of the input saved in this.state
    submitForm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()

        const inputs = {
            email: this.state.email,
            password: this.state.password
        }

        try {
            // Call the corresponding method to login and hopefully add the new user to the database
            const res = await axios.post(`${SERVER_HOST}/users/login`, inputs)
            if (res.data.errorMessage) {
                console.log(res.data.errorMessage)
            }
            else if (res.data) {
                console.log("User succcessfully logged in!")

                localStorage.accessLevel = res.data.matchedUser.accessLevel

                this.setState({
                    isLoggedIn: true
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
        const { isLoggedIn } = this.state

        return (
            isLoggedIn ? (
                <Redirect to={"/"} />
            ) : (
                <div className="authentication-page-container">
                    <Link to={"/"} className="title">
                        <img src="/images/app-logo.png" alt="" />

                        <h1>FORGED</h1>
                    </Link>

                    <form className="authentication-content">
                        <h3>Sign Up</h3>

                        <div className="inputs-container">
                            <div className="input-section">
                                <p>Email or phone no.</p>

                                <input type="text" name="email" onChange={(e) => this.handleInputChange(e)}/>
                            </div>

                            <div className="input-section">
                                <div className="forgot-password">
                                    <p>Password</p>

                                    <Link to={"/forgot-password"} className="prompt">Forgot password?</Link>
                                </div>

                                <input type="password" name="password" onChange={(e) => this.handleInputChange(e)}/>
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
                </div>
            )
        )
    }
}
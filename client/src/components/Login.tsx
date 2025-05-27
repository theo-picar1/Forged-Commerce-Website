import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Login extends Component {
    render() {
        return (
            <div className="authentication-page-container">
                <Link to={"/"} className="title">
                    <img src="/images/app-logo.png" alt=""/>

                    <h1>FORGED</h1>
                </Link>

                <form className="authentication-content">
                    <h3>Sign Up</h3>

                    <div className="inputs-container">
                        <div className="input-section">
                            <p>Email or phone no.</p>

                            <input type="text" />
                        </div>

                        <div className="input-section">
                            <div className="forgot-password">
                                <p>Password</p>

                                <Link to={"/forgot-password"} className="prompt">Forgot password?</Link>
                            </div>

                            <input type="text" />
                        </div>

                        <button className="submit-button">Sign in</button>
                    </div>

                    <div className="bottom-section">
                        <div className="message">
                            <hr/>

                            <p>New to Forged?</p>

                            <hr/>
                        </div>

                        <Link to={"/register"} className="create-account-button">Create an account</Link>
                    </div>
                </form>
            </div>
        )
    }
}
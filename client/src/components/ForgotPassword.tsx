import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Register extends Component {
    render() {
        return (
            <div className="authentication-page-container">
                <Link to={"/"} className="title">
                    <img src="/images/app-logo.png" alt="" />

                    <h1>FORGED</h1>
                </Link>

                <div className="authentication-content">
                    <div className="forgot-password-message">
                        <h3>Forgot password</h3>
                        <p>This will be your new password for signing up</p>
                    </div>

                    <div className="inputs-container">
                        <div className="input-section">
                            <p>New password</p>

                            <input type="password" />
                        </div>

                        <div className="input-section">
                            <p>Confirm password</p>

                            <input type="password" />
                        </div>

                        <button className="submit-button">Save new password</button>
                    </div>
                </div>
            </div>
        )
    }
}
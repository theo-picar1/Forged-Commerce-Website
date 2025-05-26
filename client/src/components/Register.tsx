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
                    <h3>Create account</h3>

                    <div className="inputs-container">
                        <div className="input-row-section">
                            <div className="input-section">
                                <p>First name</p>

                                <input type="text" />
                            </div>

                            <div className="input-section">
                                <p>Last name</p>

                                <input type="text" />
                            </div>
                        </div>

                        <div className="input-section">
                            <p>Email</p>

                            <input type="text" />
                        </div>

                        <div className="input-section">
                            <p>Telephone no.</p>

                            <input type="text" />
                        </div>

                        <div className="input-section">
                            <p>House address.</p>

                            <input type="text" />
                        </div>

                        <div className="input-row-section">
                            <div className="input-section">
                                <p>Password</p>

                                <input type="text" />
                            </div>

                            <div className="input-section">
                                <p>Confirm password</p>

                                <input type="text" />
                            </div>
                        </div>

                        <button className="submit-button">Create account</button>
                    </div>

                    <div className="bottom-section register-bottom-section">
                        <p>Already have an account? <Link to={"/login"}>Sign in</Link></p>
                    </div>
                </div>
            </div>
        )
    }
}
import React from "react"
import { Link } from "react-router-dom"

const Register: React.FC = () => {
    return (
        <div className="authentication-page-container">
            <Link to={"/"} className="title">
                <img src="/images/app-logo.png" alt="" />

                <h1>FORGED</h1>
            </Link>

            <form className="authentication-content">
                <h5 style={{ textAlign: "center" }}>This feature is not available. We sincerely apologise for the inconvenience!</h5>

                <div className="inputs-container">
                    <Link to={"/login"} className="submit-button link-button">Back to login</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
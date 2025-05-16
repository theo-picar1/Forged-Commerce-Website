import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Footer extends Component {

    render() {
        return (
            <React.Fragment>
                <footer id="mobile-footer-content">
                    <div className="link-grid-section">
                        <Link to="/" className="link">About Forged</Link>

                        <Link to="/" className="link">Contact Us</Link>

                        <Link to="/" className="link">Return Policy</Link>

                        <Link to="/" className="link">Accessibility</Link>

                        <Link to="/" className="link">Your Account</Link>

                        <Link to="/" className="link">FAQs</Link>

                        <Link to="/" className="link">Complaints</Link>

                        <Link to="/" className="link">Cookies</Link>
                    </div>

                    <p className="copyright-notice">&copy; 2025, All rights reserved | Theo Picar</p>
                </footer>

                <footer id="laptop-footer-content">
                    laptop footer
                </footer>
            </React.Fragment>
        )
    }
}
import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { ACCESS_LEVEL_GUEST, SERVER_HOST } from "../config/global_constants.ts"

interface MenuProps {
    categories: string[]
    capitiliseString: (input: string) => string
    closeSlideInModal: (modalToToggle: string) => void
}

const Menu: React.FC<MenuProps> = ({
    categories,
    capitiliseString,
    closeSlideInModal
}) => {
    // WHen user logs out, it removes clears the access level and user id in localStorage
    const logout = async (): Promise<void> => {
        try {
            const res = await axios.post(`${SERVER_HOST}/users/logout`)

            if (res.data.errorMessage) {
                console.log(res.data.errorMessage)
            }
            else if (res.data) {
                console.log("User succcessfully logged in!")

                localStorage.clear()
                window.location.reload()
            }
            else {
                console.log("Registration failed")
            }
        }
        catch (error) {
            console.log("Failed to log out")
        }
    }

    return (
        <div className="slide-in-modal" id="menu-modal">
            <div className="slide-in-modal-content" id="menu-modal-content">
                <header>
                    <h5>Menu</h5>

                    <img src="/images/close-icon.png" alt="Close button icon" onClick={() => closeSlideInModal("menu-modal")} />
                </header>

                <main>
                    <div className="section">
                        <div className="title">
                            <h5>General</h5>
                        </div>

                        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                            <Link to={"/edit-account"} className="link">
                                <p>Edit Account</p>
                            </Link>
                        ) : (
                            <Link to={"/login"} className="link">
                                <p>Edit Account</p>
                            </Link>
                        )}

                        <div>
                            <Link to={"/purchase-history"} className="link">
                                <p>Purchase History</p>
                            </Link>
                        </div>

                        <div>
                            <p>Favourites</p>
                        </div>

                        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                            <div>
                                <p style={{ color: "red" }} onClick={() => logout()}>Sign out</p>
                            </div>
                        ) : (
                            <Link className="link" to={"/login"}>
                                <p>Sign in</p>
                            </Link>
                        )}
                    </div>

                    <div className="section">
                        <div className="title">
                            <h5>Categories</h5>
                        </div>

                        {categories.map(category =>
                            <div key={category}>
                                <p>{capitiliseString(category)}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Menu
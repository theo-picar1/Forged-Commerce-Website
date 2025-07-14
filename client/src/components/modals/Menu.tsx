import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"

// axios
import axios from "axios"
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../../config/global_constants.ts"

import { capitiliseString } from "../../utils/string-utils.ts"
import { closeSlideInModal } from "../../utils/dom-utils.ts"

interface MenuProps {
    categories?: string[]
}

const Menu: React.FC<MenuProps> = ({
    categories
}) => {
    const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false)

    // When user logs out, it removes clears the access level and user id in localStorage
    const logout = async (): Promise<void> => {
        try {
            const res = await axios.post(`${SERVER_HOST}/users/logout`)

            if (res.data.errorMessage) {
                console.log(res.data.errorMessage)
            }
            else if (res.data) {
                console.log("User succcessfully logged out!")

                localStorage.clear()
                setIsLoggedOut(true)
            }
            else {
                console.log("Registration failed")
            }
        }
        catch (error) {
            console.log("Failed to log out")
        }
    }

    if(isLoggedOut) return <Navigate to="/login" replace />

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

                        {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                            <React.Fragment>
                                <div>
                                    {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                                        <Link to={"/edit-account"} className="link">
                                            <p>Edit Account</p>
                                        </Link>
                                    ) : (
                                        <Link to={"/login"} className="link">
                                            <p>Edit Account</p>
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    <Link to={"/purchase-history"} className="link">
                                        <p>Purchase History</p>
                                    </Link>
                                </div>

                                <div>
                                    <Link to={"/favourites"} className="link">
                                        <p>Favourites</p>
                                    </Link>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div>
                                    <Link to={"/admin"} className="link">
                                        <p>Users Manager</p>
                                    </Link>
                                </div>

                                <div>
                                    <Link to={"products"} className="link">
                                        <p>Products Manager</p>
                                    </Link>
                                </div>

                                <div className="link">
                                    <p>Categories Manager</p>
                                </div>
                            </React.Fragment>
                        )}

                        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                            <div>
                                <p style={{ color: "red" }} onClick={() => logout()}>Sign out</p>
                            </div>
                        ) : (
                            <div>
                                <Link className="link" to={"/login"}>
                                    <p>Sign in</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                        <div className="section">
                            <div className="title">
                                <h5>Categories</h5>
                            </div>

                            {categories?.map(category =>
                                <div key={category}>
                                    <p>{capitiliseString(category)}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        null
                    )}
                </main>
            </div>
        </div>
    )
}

export default Menu
import React, { Component } from "react"
import { Link } from "react-router-dom"

import { ACCESS_LEVEL_GUEST } from "../config/global_constants.ts"

interface MenuProps {
    categories: string[]
    capitiliseString: (input: string) => string
    closeSlideInModal: (modalToToggle: string) => void
}

export default class Menu extends Component<MenuProps> {
    render() {
        const { categories, capitiliseString, closeSlideInModal } = this.props

        return (
            <div className="slide-in-modal" id="menu-modal">
                <div className="slide-in-modal-content" id="menu-modal-content">
                    <header>
                        <h5>Menu</h5>

                        <img src="/images/close-icon.png" alt="Close button icon" onClick={ () => closeSlideInModal("menu-modal") } />
                    </header>

                    <main>
                        <div className="section">
                            <div className="title">
                                <h5>General</h5>
                            </div>

                            <Link to={"/login"} className="link">
                                <p>Edit Account</p>
                            </Link>

                            <div>
                                <p>Purchase History</p>
                            </div>

                            <div>
                                <p>Favourites</p>
                            </div>

                            { localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                                <div>
                                    <p style={{ color: "red" }}>Sign out</p>
                                </div>
                            ) : (
                                <Link className="link" to={"/login"}>
                                    <p>Sign in</p>
                                </Link>
                            ) }
                        </div>

                        <div className="section">
                            <div className="title">
                                <h5>Categories</h5>
                            </div>

                            {categories.map(category =>
                                <div key={ category }>
                                    <p>{capitiliseString(category)}</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}
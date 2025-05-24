import React, { Component } from "react"

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

                            <div>
                                <p>Edit Account</p>
                            </div>

                            <div>
                                <p>Purchase History</p>
                            </div>

                            <div>
                                <p>Favourites</p>
                            </div>

                            <div>
                                <p style={{ color: "red" }}>Sign out</p>
                            </div>
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
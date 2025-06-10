import React, { Component, createRef } from "react"
import { Link, withRouter } from "react-router-dom"
// Don't remember why but I need this for export default withRouter(Home) at bottom of file
import { RouteComponentProps } from 'react-router-dom' 

import { Product } from "../types/Product"
import { Cart } from "../types/Cart"

interface HeaderProps extends RouteComponentProps {
    categories: string[]
    capitiliseString: (input: string) => string
    openSlideInModal: (modalToToggle: string) => void
    displayAutocompleteSuggestions: (e: React.ChangeEvent<HTMLInputElement>) => void
    productSearchValue: string
    suggestions: Product[]
    completeAutocomplete: (value: string) => void
    filterProductsBySearchValue: (e: React.KeyboardEvent<HTMLInputElement>) => void
    filterProductsByHeaderCategory: (value: string) => void
    cart: Cart | null
}

type HeaderState = {
    atStart: boolean
    atEnd: boolean
}

class Header extends Component<HeaderProps, HeaderState> {
    bottomRef: React.RefObject<HTMLDivElement | null> = createRef()

    constructor(props: HeaderProps) {
        super(props)

        this.state = {
            atStart: true,
            atEnd: false
        }
    }

    componentDidMount() {
        this.updateScrollShadows()

        if (this.bottomRef.current) {
            this.bottomRef.current.addEventListener("scroll", this.updateScrollShadows)
        }

        window.addEventListener("resize", this.updateScrollShadows)

        // JS logic that blurs either side depending on how far the user has scrolled in .bottom-wrapper. Might remove this
        let bottomSection = document.querySelector('.bottom-wrapper') as HTMLElement
        let topSection = document.querySelector('.top') as HTMLElement

        // If the scrollY position is 10px down, hide the categories section in the header to minimise content
        window.addEventListener('scroll', () => {
            let scrollY = window.scrollY

            if (scrollY > 10) {
                bottomSection.classList.add('hide')
                topSection.classList.add('hide')
            }
            else {
                bottomSection.classList.remove('hide')
                topSection.classList.remove('hide')
            }
        })
    }

    componentWillUnmount() {
        if (this.bottomRef.current) {
            this.bottomRef.current.removeEventListener("scroll", this.updateScrollShadows)
        }

        window.removeEventListener("resize", this.updateScrollShadows)
    }

    updateScrollShadows = () => {
        /* 
            scrollLeft = pixels scrolled from the left
            clientWidth = width of the element where the scrollable elements are
            scrollWidth = the entire width of the scrollable content
        */
        const el = this.bottomRef.current
        let atStart: boolean
        let atEnd: boolean

        if (el) {
            atStart = el.scrollLeft === 0
            atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth

            this.setState({ atStart, atEnd })
        }
    }

    render() {
        // To stop saying this.props and this.state EVERY SINGLE TIME
        const {
            categories,
            capitiliseString,
            openSlideInModal,
            displayAutocompleteSuggestions,
            productSearchValue,
            suggestions,
            completeAutocomplete,
            filterProductsBySearchValue,
            filterProductsByHeaderCategory,
            cart
        } = this.props

        const { atStart, atEnd } = this.state

        return (
            <React.Fragment>
                <header className="website-header top">
                    <div className="top theos-row">
                        <div className="left">
                            <img src="/images/menu-icon.png" alt="Menu button" className="menu-icon" onClick={() => openSlideInModal("menu-modal")} />

                            <Link to="/" className="link">
                                <div className="website-title">
                                    <img src="/images/app-logo.png" alt="" />
                                    <p>FORGED</p>
                                </div>
                            </Link>
                        </div>

                        <div className="right">
                            <Link to="/cart" className="link">
                                <div className="shopping-cart">
                                    <img src="/images/shopping-cart.png" alt="Shopping cart button" />
                                    <div>
                                        <p>{ !cart ? 0 : cart.products.length}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="middle theos-row">
                        <div className="searchbar-container">
                            <input id="product-searchbar" type="text" placeholder="Search for products" autoComplete="off" value={productSearchValue}
                                onChange={e => displayAutocompleteSuggestions(e)}
                                onKeyDown={e => filterProductsBySearchValue(e)}
                            />

                            <div>
                                <img src="/images/search-icon.png" alt="Search icon" />
                            </div>
                        </div>

                        {suggestions.length > 0 && (
                            <div id="product-autocomplete-modal">
                                {suggestions.map(product =>
                                    <div key={product["_id"]} onClick={() => completeAutocomplete(product["product_name"])}>
                                        <img src="/images/search-icon.png" />

                                        <p>{product["product_name"]}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`bottom-wrapper theos-row ${atStart ? "at-start" : ""} ${atEnd ? "at-end" : ""}`}>
                        <div className="bottom" ref={this.bottomRef}>
                            <label className="category-radio">
                                <input
                                    type="radio"
                                    className="header-category"
                                    value=""
                                    name="header-category"
                                    onClick={() => filterProductsByHeaderCategory("")} />

                                <p>All</p>
                            </label>

                            {categories.map(category =>
                                <label className="category-radio" key={category}>
                                    <input
                                        type="radio"
                                        className="header-category"
                                        name="header-category"
                                        value={category}
                                        onClick={() => filterProductsByHeaderCategory(`${category}`)} />

                                    <p>{capitiliseString(category)}</p>
                                </label>
                            )}
                        </div>
                    </div>
                </header>
            </React.Fragment>
        )
    }
}

export default withRouter(Header)
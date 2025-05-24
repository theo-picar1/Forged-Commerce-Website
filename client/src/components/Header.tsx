import React, { Component, createRef } from "react"
import { Link, withRouter } from "react-router-dom"

class Header extends Component {
    constructor(props) {
        super(props)
        this.bottomRef = createRef()

        this.state = {
            atStart: true,
            atEnd: false
        }
    }

    componentDidMount() {
        this.updateScrollShadows()
        this.bottomRef.current.addEventListener("scroll", this.updateScrollShadows)
        window.addEventListener("resize", this.updateScrollShadows)

        // JS logic that blurs either side depending on how far the user has scrolled in .bottom-wrapper. Might remove this
        let bottomSection = document.querySelector('.bottom-wrapper')
        let topSection = document.querySelector('.top')

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
        this.bottomRef.current.removeEventListener("scroll", this.updateScrollShadows)
        window.removeEventListener("resize", this.updateScrollShadows)
    }

    updateScrollShadows = () => {
        /* 
            scrollLeft = pixels scrolled from the left
            clientWidth = width of the element where the scrollable elements are
            scrollWidth = the entire width of the scrollable content
        */
        const el = this.bottomRef.current
        const atStart = el.scrollLeft === 0
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth

        this.setState({ atStart, atEnd })
    }

    render() {
        // To stop saying this.props and this.state EVERY SINGLE TIME
        const { categories, 
                capitiliseString, 
                openSlideInModal, 
                displayAutocompleteSuggestions, 
                productSearchValue, suggestions, 
                completeAutocomplete, 
                filterProductsBySearchValue,
                filterProductsByHeaderCategory } = this.props
        const { atStart, atEnd } = this.state

        return (
            <React.Fragment>
                <header className="website-header" name="top">
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
                                    <div><p>0</p></div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="middle theos-row">
                        <div className="searchbar-container">
                            <input id="product-searchbar" type="text" placeholder="Search for products" autoComplete="off" value={productSearchValue} 
                                onChange={e => displayAutocompleteSuggestions(e) }
                                onKeyDown={e => filterProductsBySearchValue(e)}
                            />

                            <div>
                                <img src="/images/search-icon.png" alt="Search icon" />
                            </div>
                        </div>

                        { suggestions.length > 0 && (
                            <div id="product-autocomplete-modal">
                                { suggestions.map(product => 
                                    <div key={product["product_id"]} onClick={() => completeAutocomplete(product["product_name"])}>
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
                                    onClick={ (e) => filterProductsByHeaderCategory(e)}/>

                                <p>All</p>
                            </label>

                            {categories.map(category =>
                                <label className="category-radio" key={category}> 
                                    <input 
                                        type="radio" 
                                        className="header-category" 
                                        name="header-category"
                                        value={category} 
                                        onClick={ (e) => filterProductsByHeaderCategory(e)}/>

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
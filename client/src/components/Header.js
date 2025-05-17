import React, { Component, createRef } from "react"
import { Link } from "react-router-dom"

export default class Header extends Component {
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

        let bottomWrapper = document.querySelector('.bottom-wrapper')

        // If the scrollY position is 10px down, hide the categories section in the header to minimise content
        window.addEventListener('scroll', () => {
            let scrollY = window.scrollY

            if (scrollY > 10) {
                bottomWrapper.classList.add('hide')
            } 
            else {
                bottomWrapper.classList.remove('hide')
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
        const { categories, capitiliseString, openSlideInModal } = this.props
        const { atStart, atEnd } = this.state

        return (
            <header className="website-header" name="top">
                <div className="top row">
                    <div className="left">
                        <img src="/images/menu-icon.png" alt="Menu button" className="menu-icon" onClick={ () => openSlideInModal("menu-modal") } />
                        
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

                <div className="middle row">
                    <div className="searchbar-container">
                        <input type="text" placeholder="Search for products" autoComplete="off" />
                        <div><img src="/images/search-icon.png" alt="Search icon" /></div>
                    </div>
                </div>

                <div className={`bottom-wrapper row ${atStart ? "at-start" : ""} ${atEnd ? "at-end" : ""}`}>
                    <div className="bottom" ref={this.bottomRef}>
                        <p>All</p>
                        {categories.map(category =>
                            <Link to="/products" className="link" key={category}>
                                <p>{capitiliseString(category)}</p>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        )
    }
}
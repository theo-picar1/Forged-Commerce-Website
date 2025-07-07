import React, { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"

// axios || constants
import { ACCESS_LEVEL_ADMIN } from "../../config/global_constants"

// types
import { Product } from "../../types/Product"

// functions
import { capitiliseString } from "../../utils/string-utils"
import { openSlideInModal } from "../../utils/dom-utils"

interface HeaderProps {
    categories: string[]
    displayAutocompleteSuggestions: (e: React.ChangeEvent<HTMLInputElement>) => void
    productSearchValue: string
    suggestions: Product[]
    completeAutocomplete: (value: string) => void
    filterProductsBySearchValue: (e: React.KeyboardEvent<HTMLInputElement>) => void
    filterProductsByHeaderCategory: (value: string) => void
    cartLength: number
}

const Header: React.FC<HeaderProps> = ({
    categories,
    displayAutocompleteSuggestions,
    productSearchValue,
    suggestions,
    completeAutocomplete,
    filterProductsBySearchValue,
    filterProductsByHeaderCategory,
    cartLength
}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null) // To keep track of scroll
    const [atStart, setStart] = useState<boolean>(false)
    const [atEnd, setEnd] = useState<boolean>(false)


    const updateScrollShadows = (): void => {
        /* 
            scrollLeft = pixels scrolled from the left
            clientWidth = width of the element where the scrollable elements are
            scrollWidth = the entire width of the scrollable content
        */
        const el = bottomRef.current

        if (el) {
            setStart(el.scrollLeft === 0) // Set atStart to true if at the original position
            setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth)
        }
    }

    useEffect(() => {
        updateScrollShadows()

        // Run updateScrollShadows if we're starting to scroll horizontally
        if (bottomRef.current) {
            bottomRef.current.addEventListener("scroll", updateScrollShadows)
        }

        window.addEventListener("resize", updateScrollShadows)

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

        return () => {
            if (bottomRef.current) {
                bottomRef.current.removeEventListener("scroll", updateScrollShadows)
            }

            window.removeEventListener("resize", updateScrollShadows)
        }
    }, [])

    return (
        <React.Fragment>
            <header className="website-header top">
                <div className="top theos-row">
                    <div className="left">
                        <img src="/images/menu-icon.png" alt="Menu button" className="menu-icon" onClick={() => openSlideInModal("menu-modal")} />

                        <Link to="" className="link">
                            <div className="website-title">
                                <img src="/images/app-logo.png" alt="" />
                                <p>FORGED</p>
                            </div>
                        </Link>
                    </div>

                    {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                        <div className="right">
                            <Link to="cart" className="link">
                                <div className="shopping-cart">
                                    <img src="/images/shopping-cart.png" alt="Shopping cart button" />
                                    <div>
                                        <p>{cartLength}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : null}
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
                    <div className="bottom" ref={bottomRef}>
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

export default Header
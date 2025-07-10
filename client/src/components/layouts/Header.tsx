import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// axios || constants
import { ACCESS_LEVEL_ADMIN } from "../../config/global_constants"

// types
import { Product } from "../../types/Product"

// functions
import { openSlideInModal } from "../../utils/dom-utils"
import { findProductsWithPrefix } from "../../utils/product-utils"

interface HeaderProps {
    products: Product[]
    cartLength: number
}

const Header: React.FC<HeaderProps> = ({
    products,
    cartLength
}) => {
    // State variables
    const [matchedProducts, setMatchedProducts] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Navigation
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <header className="website-header top">
                <div className="top theos-row">
                    <div className="left">
                        <img src="/images/menu-icon.png" alt="Menu button" className="menu-icon" onClick={() => openSlideInModal("menu-modal")} />

                        <Link to="" className="website-title">
                            <img src="/images/app-logo.png" alt="" />
                            <p>FORGED</p>
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
                        <input
                            id="product-searchbar"
                            type="text"
                            placeholder="Search for products"
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => {
                                const value = e.currentTarget.value
                                setSearchQuery(value)
                                setMatchedProducts(findProductsWithPrefix(value, products))
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setMatchedProducts([])
                                    navigate(`/products/${searchQuery}`)
                                }
                            }}
                        />

                        <div>
                            <img src="/images/search-icon.png" alt="Search icon" />
                        </div>
                    </div>

                    {matchedProducts.length > 0 && (
                        <div id="product-autocomplete-modal">
                            {matchedProducts.map(product =>
                                <div key={product["_id"]} onClick={() => {
                                    setSearchQuery(product["product_name"])
                                    setMatchedProducts([])
                                }}>
                                    <img src="/images/search-icon.png" />

                                    <p>{product["product_name"]}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </React.Fragment>
    )
}

export default Header
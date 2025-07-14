import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

// global constants / axios
import { ACCESS_LEVEL_ADMIN } from "../../config/global_constants"

// types
import { Product } from "../../types/Product"
import { User } from "../../types/User"

// functions
import { openSlideInModal } from "../../utils/dom-utils"
import { findProductsWithPrefix } from "../../utils/product-utils"
import { findUsersWithPrefix } from "../../utils/user-utils"

interface HeaderProps {
    products: Product[]
    cartLength?: number
    users?: User[]
}

const Header: React.FC<HeaderProps> = ({
    products,
    cartLength = 0,
    users = []
}) => {
    // State variables
    const [matchedResults, setMatchedResults] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [placeholder, setPlaceholder] = useState<string>("")

    // React router variables
    const navigate = useNavigate()
    const location = useLocation()
    const isAdmin = localStorage.accessLevel >= ACCESS_LEVEL_ADMIN

    // Logic to just conditionally change the searchbar placeholder depending on URL
    useEffect(() => {
        const path = location.pathname

        // Users
        if (path.startsWith("/admin/users/")) { 
            setPlaceholder("Search for users") 
        }
        else {
            setPlaceholder("Search for products")
        }
    }, [location.pathname])

    // Update state of search bar value and suggestions that will show up on autocomplete modal
    const setAutocompleteSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value

        setSearchQuery(value)

        switch (placeholder) {
            case "Search for users":
                setMatchedResults(findUsersWithPrefix(value, users))
                break;
            default:
                setMatchedResults(findProductsWithPrefix(value, products))
                break
        }
    }

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

                    {!isAdmin && (
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
                    )}
                </div>

                <div className="middle theos-row">
                    <div className="searchbar-container">
                        <input
                            id="product-searchbar"
                            type="text"
                            placeholder={placeholder}
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => {
                                setAutocompleteSuggestions(e)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setMatchedResults([])

                                    // Redirection for whatever searchbar is set to
                                    if (placeholder === "Search for products") {
                                        navigate(`products/${searchQuery}`)
                                    }
                                    else if (placeholder === "Search for users") {
                                        navigate(`users/${searchQuery}`)
                                    }
                                }
                            }}
                        />

                        <div>
                            <img src="/images/search-icon.png" alt="Search icon" />
                        </div>
                    </div>

                    {matchedResults.length > 0 && (
                        <div id="search-autocomplete-modal">
                            {placeholder === "Search for products" ? (
                                matchedResults.map(product =>
                                    <div key={product._id} onClick={() => {
                                        setSearchQuery(product.product_name)
                                        setMatchedResults([])
                                    }}>
                                        <img src="/images/search-icon.png" />

                                        <p>{product.product_name}</p>
                                    </div>
                                )
                            ) : (
                                matchedResults.map(user =>
                                    <div key={user._id} onClick={() => {
                                        const fullName = user.firstName + " " + user.lastName

                                        setSearchQuery(fullName)
                                        setMatchedResults([])
                                    }}>
                                        <img src="/images/search-icon.png" />

                                        <p>{user.firstName}  {user.lastName}</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </header>
        </React.Fragment>
    )
}

export default Header
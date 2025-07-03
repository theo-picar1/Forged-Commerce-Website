import React, { useState, useEffect, JSX } from "react"

import { Product } from "../types/Product"
import { Link } from "react-router-dom"

import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants"

// Interface is for the props being passed to this component
interface ProductsProps {
    originalProducts: Product[]
    filteredProducts: Product[]
    switchProductViewImage: (view: string) => void
    currentView: string
    openSlideInModal: (modalToToggle: string) => void
    closeSlideInModal: (modalToToggle: string) => void
    categories: string[]
    capitiliseString: (string: string) => string
    counterMap: Map<string, number>
    addProductToCart: (product: Product) => void
}

function createStarsForProduct(rating: number): JSX.Element[] {
    // Because JSX doesn't allow for-loops, use Array.from that runs 'product_rating rounded down' times to create a star image
    // Condition '_' is there because I'm not accessing a particular element
    return Array.from({ length: Math.floor(rating) }, (_, i) => (
        <img key={i} src="/images/filled-star-icon.png" alt="" />
    ))
}

const Products: React.FC<ProductsProps> = ({
    originalProducts,
    filteredProducts,
    switchProductViewImage,
    currentView,
    openSlideInModal,
    closeSlideInModal,
    categories,
    capitiliseString,
    counterMap,
    addProductToCart
}) => {
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(1000)
    const [minLimit, setMinLimit] = useState<number>(0)
    const [maxLimit, setMaxLimit] = useState<number>(1000)
    const [minRating, setMinRating] = useState<number>(1)
    const [maxRating, setMaxRating] = useState<number>(5)
    const [checkedCategories, setCheckedCategories] = useState<string[]>([])
    const [checkedConditions, setCheckedConditions] = useState<string[]>([])
    const [productsToShow, setProductsToShow] = useState<Product[]>(originalProducts)

    // ---------- ChatGPT Slide Code Logic ----------
    // This is so that right thumb can't go any lower than left thumb
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // Just to make sure that it is a number
        const inputValue = Number(e.target.value)

        // Ensure inputValue is a valid number before comparing
        if (!isNaN(inputValue)) {
            const newMin = Math.min(inputValue, maxPrice - 1)

            setMinPrice(newMin)
        }
    }

    // Same logic as above but for the left thumb to not go above right thumb
    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const inputValue = Number(e.target.value)

        if (!isNaN(inputValue)) {
            const newMax = Math.max(inputValue, minPrice + 1)

            setMaxPrice(newMax)
        }
    }
    // -----------------------------------------------

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name } = e.target
        let val: number = Number(e.target.value)

        switch (name) {
            case "minRating": setMinRating(val); break
            case "maxRating": setMaxRating(val); break
        }
    }

    const handleCategoryChange = (): void => {
        let checkboxes = Array.from(document.getElementsByClassName("advanced-filter-product-checkbox")) as HTMLInputElement[]
        let initCategories: string[] = []

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                initCategories.push(checkbox.value)
            }
        })

        setCheckedCategories(initCategories)
    }

    // Brand new or used products
    const handleConditionChange = (): void => {
        let checkboxes = Array.from(document.getElementsByClassName("advanced-filter-condition-checkbox")) as HTMLInputElement[]
        let initConditions: string[] = []

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                initConditions.push(checkbox.value)
            }
        })

        setCheckedConditions(initConditions)
    }

    function applyFilters(): void {
        let advancedFilteredProducts = originalProducts.filter(product => {
            // Only get products that has atleast one of the tags that the user selected.
            let matchedCategories = checkedCategories.some(checkedValue => product["category"].map(category => category.toLowerCase()).includes(checkedValue.toLowerCase()))

            // Same logic but with conditions and it handle booleans.
            let productCondition
            if (product["brand_new"]) {
                productCondition = "new"
            }
            else {
                productCondition = "used"
            }

            let matchedConditions = checkedConditions.some(checkedValue => productCondition.toLowerCase() === checkedValue.toLowerCase())

            let matchedRating = product["product_rating"] >= minRating && product["product_rating"] <= maxRating

            let matchedPrice = product["price"] >= minPrice && product["price"] <= maxPrice

            // Only return the product that has some of the selected categories and has rating between given range
            if (matchedCategories && matchedRating && matchedPrice && matchedConditions) {
                return product
            }
        })

        setProductsToShow(advancedFilteredProducts)
    }

    useEffect(() => {
        switchProductViewImage(currentView) // This is so that when Products is mounted again later when it was originally in list view, it won't revert back to a grid view with the icon not changing either

        // This is just to make the filtering functionality less complicated by removing the categroies in the header
        let bottomWrapper = document.querySelector(".bottom-wrapper") as HTMLElement
        bottomWrapper.style.height = "0"

        setProductsToShow(filteredProducts)

        handleCategoryChange()
        handleConditionChange()

        // IMPORTANT: this is the 'componentWillUnmount' equivalent
        return () => {
            // And just make it appear again later on
            let bottomWrapper = document.querySelector(".bottom-wrapper") as HTMLElement
            bottomWrapper.style.height = "auto"
        }
    }, [productsToShow])

    return (
        <div className="products-page-container">
            <div className="slide-in-modal" id="advanced-product-filters-modal">
                <div className="slide-in-modal-content" id="advanced-product-filters-modal-content">
                    <header>
                        <h5>Filters</h5>

                        <img src="/images/close-icon.png" alt="Close button icon" onClick={() => closeSlideInModal("advanced-product-filters-modal")} />
                    </header>

                    <main>
                        <div className="section">
                            <div className="title">
                                <h5>Categories</h5>
                            </div>

                            <div className="content">
                                {categories.map(category =>
                                    <div className="checkbox-container" key={category}>
                                        <label key={category}>
                                            <input type="checkbox" value={category} className="advanced-filter-product-checkbox checkbox" onChange={handleCategoryChange} />

                                            <p>{capitiliseString(category)}</p>
                                        </label>

                                        <p>{counterMap.get(category)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="section">
                            <div className="title">
                                <h5>Price (€)</h5>
                            </div>

                            <div className="content">
                                <div className="min-max-inputs-container">
                                    <label className="min">
                                        <p>Min</p>

                                        <input type="number" id="min-price-value" autoComplete="off" min={minLimit} value={minPrice} onChange={handleMinChange} />
                                    </label>

                                    <p className="dash">-</p>

                                    <label className="max">
                                        <p>Max</p>

                                        <input type="number" id="max-price-value" max={maxLimit} autoComplete="on" value={maxPrice} onChange={handleMaxChange} />
                                    </label>
                                </div>

                                {/* Slider with double thumbs made by ChatGPT */}
                                <div className="slider-container">
                                    <div className="slider">
                                        <input
                                            type="range"
                                            min={minLimit}
                                            max={maxLimit}
                                            value={minPrice}
                                            onChange={handleMinChange}
                                            className="thumb thumb-left"
                                        />

                                        <input
                                            type="range"
                                            min={minLimit}
                                            max={maxLimit}
                                            value={maxPrice}
                                            onChange={handleMaxChange}
                                            className="thumb thumb-right"
                                        />

                                        <div className="slider-track" />

                                        <div
                                            className="slider-range"
                                            style={{
                                                left: `${(minPrice / maxLimit) * 100}%`,
                                                width: `${((maxPrice - minPrice) / maxLimit) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="title">
                                <h5>Rating</h5>
                            </div>

                            <div className="content">
                                <div className="min-max-inputs-container">
                                    <label className="min">
                                        <p>Min</p>

                                        <input type="number" name="minRating" id="min-rating-value" autoComplete="off" min="0" max={maxRating} value={minRating} onChange={handleRatingChange} />
                                    </label>

                                    <p className="dash">-</p>

                                    <label className="max">
                                        <p>Max</p>

                                        <input type="number" name="maxRating" id="max-rating-value" min={minRating} max="5" autoComplete="off" value={maxRating} onChange={handleRatingChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="title">
                                <h5>Condition</h5>
                            </div>

                            <div className="content">
                                <div className="checkbox-container">
                                    <label>
                                        <input type="checkbox" value="new" className="advanced-filter-condition-checkbox checkbox" onChange={handleConditionChange} />

                                        <p>New</p>
                                    </label>

                                    <p>{counterMap.get("new")}</p>
                                </div>

                                <div className="checkbox-container">
                                    <label>
                                        <input type="checkbox" value="used" className="advanced-filter-condition-checkbox checkbox" onChange={handleConditionChange} />

                                        <p>Used</p>
                                    </label>

                                    <p>{counterMap.get("used")}</p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer>
                        <div id="clear-all-filters-button">
                            <p>Clear All</p>
                        </div>

                        <div id="apply-filters-button" onClick={() => {
                            closeSlideInModal("advanced-product-filters-modal")
                            applyFilters()
                        }}>
                            <p>Apply Filters</p>
                        </div>
                    </footer>
                </div>
            </div>

            {localStorage.accessLevel == ACCESS_LEVEL_ADMIN ? (
                <div className="admin-tools">
                    <button onClick={() => openSlideInModal("add-product-modal")}>
                        <p>Add product</p>
                    </button>

                    <button>
                        <p>Delete products</p>
                    </button>
                </div>
            ) : null}

            <div className="filter-tools">
                <div className="left">
                    <div className="filter-button" onClick={() => openSlideInModal("advanced-product-filters-modal")}>
                        <img src="/images/filter-icon.png" alt="Filter icon button" />

                        <p>Filters</p>
                    </div>
                </div>

                <div className="right">
                    <select>
                        <option>Newest Products</option>
                    </select>

                    {currentView === "grid" && (
                        <img src="/images/list-icon.png" alt="Change to list view icon" onClick={() => {
                            switchProductViewImage("list")
                        }} />
                    )}

                    {currentView === "list" && (
                        <img src="/images/grid-icon.png" alt="Change to grid view icon" onClick={() => {
                            switchProductViewImage("grid")
                        }} />
                    )}
                </div>
            </div>

            {productsToShow.length > 0 ? (
                <main id="products-section">
                    {productsToShow.map(product =>
                        <div className="product" key={product._id}>
                            <Link to={`/product/${product._id}`} className="product-image-container">
                                <img
                                    id="product-image"
                                    src={
                                        // Check if URL was copy and pasted from the web
                                        product.product_images[0].startsWith('http://') ||
                                            product.product_images[0].startsWith('https://')
                                            ? product.product_images[0]
                                            : `${SERVER_HOST}/uploads/${product.product_images[0]}`
                                    }
                                />
                            </Link>


                            <div className="product-details">
                                <p className="product-name">{product["product_name"]}</p>

                                <div className="product-rating">
                                    {createStarsForProduct(product["product_rating"])}

                                    <p>{product["no_of_reviews"]}</p>
                                </div>

                                {product["stock_quantity"] < 15 ? (
                                    <p className="stock-notice">Only {product["stock_quantity"]} left!</p>
                                ) : null
                                }

                                <div className="product-bottom-section">
                                    <p>€{product["price"]}</p>

                                    {localStorage.accessLevel < ACCESS_LEVEL_ADMIN ? (
                                        <div className="add-to-shopping-cart-button" onClick={() => addProductToCart(product)}>
                                            <img src="/images/shopping-cart.png" alt="Add to shopping cart button" />
                                        </div>
                                    ) : (
                                        <div className="admin-tools">
                                            <Link to={`/edit-product/${product._id}`} className="button">
                                                <img src="/images/edit-icon.png" className="edit-icon" />
                                            </Link>

                                            <div className="button">
                                                <img src="/images/bin-icon.png" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            ) : (
                <h3 className="no-matching-products">No matching products found!</h3>
            )}
        </div>
    )
}

export default Products
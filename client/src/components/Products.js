import React, { Component } from "react"

export default class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minPrice: 0,
            maxPrice: 1000,
            minLimit: 0,
            maxLimit: 1000,
            minRating: 1,
            maxRating: 5,
            checkedCategories: [],
            checkedConditions: [],
            productsToShow: this.props.originalProducts
        }
    }

    // ---------- ChatGPT Slide Code Logic ----------
    // This is so that right thumb can't go any lower than left thumb
    handleMinChange = (e) => {
        const newMin = Math.min(e.target.value, this.state.maxPrice - 1)
        this.setState({ minPrice: newMin })
    }

    // Same logic as above but for the left thumb to not go above right thumb
    handleMaxChange = (e) => {
        const newMax = Math.max(e.target.value, this.state.minPrice + 1)
        this.setState({ maxPrice: newMax })
    }
    // -----------------------------------------------

    handleRatingChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCategoryChange = () => {
        let checkboxes = document.querySelectorAll(".advanced-filter-product-checkbox")
        let initCategories = []

        checkboxes.forEach(checkbox => {
            if(checkbox.checked) {
                initCategories.push(checkbox.value)
            }
        })

        this.setState({
            checkedCategories: initCategories
        })
    }

    // Brand new or used products
    handleConditionChange = () => {
        console.log("hello")
        let checkboxes = document.querySelectorAll(".advanced-filter-condition-checkbox")
        let initConditions = []

        checkboxes.forEach(checkbox => {
            if(checkbox.checked) {
                initConditions.push(checkbox.value)
            }
        })

        this.setState({
            checkedConditions: initConditions
        })
    }

    applyFilters() {
        console.log(this.state.checkedConditions)

        let advancedFilteredProducts = this.props.originalProducts.filter(product => {
                // Only get products that has atleast one of the tags that the user selected.
                let matchedCategories = this.state.checkedCategories.some(checkedValue => product["category"].map(category => category.toLowerCase()).includes(checkedValue.toLowerCase()))

                // Same logic but with conditions and it handle booleans.
                let productCondition
                if(product["brand_new"]) {
                    productCondition = "new"
                }
                else {
                    productCondition = "used"
                }

                let matchedConditions = this.state.checkedConditions.some(checkedValue => productCondition.toLowerCase() === checkedValue.toLowerCase())

                let matchedRating = product["product_rating"] >= this.state.minRating && product["product_rating"] <= this.state.maxRating

                let matchedPrice = product["price"] >= this.state.minPrice && product["price"] <= this.state.maxPrice

                // Only return the product that has some of the selected categories and has rating between given range
                if (matchedCategories && matchedRating && matchedPrice && matchedConditions) {
                    return product
                }
        }) 

        this.setState({
            productsToShow: advancedFilteredProducts
        })
    }

    createStarsForProduct(rating) {
        // Because JSX doesn't allow for-loops, use Array.from that runs 'product_rating rounded down' times to create a star image
        // Condition '_' is there because I'm not accessing a particular element
        return Array.from({ length: Math.floor(rating) }, (_, i) => (
            <img key={i} src="/images/filled-star-icon.png" alt="" />
        ))
    }

    componentDidMount() {
        this.props.switchProductViewImage(this.props.currentView) // This is so that when Products is mounted again later when it was originally in list view, it won't revert back to a grid view with the icon not changing either

        // This is just to make the filtering functionality less complicated
        let bottomWrapper = document.querySelector(".bottom-wrapper")
        bottomWrapper.style.height = "0"

        this.setState({
            productsToShow: this.props.filteredProducts
        }, () => {
            this.handleCategoryChange()
            this.handleConditionChange()
        })
    }

    componentWillUnmount() {
        // And just make it appear again later on
        let bottomWrapper = document.querySelector(".bottom-wrapper")
        bottomWrapper.style.height = "auto"
    }

    render() {
        const { currentView, switchProductViewImage, closeSlideInModal, openSlideInModal, categories, capitiliseString, counterMap } = this.props
        const { minPrice, maxPrice, minLimit, maxLimit, minRating, maxRating, productsToShow } = this.state

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
                                                <input type="checkbox" value={category} className="advanced-filter-product-checkbox checkbox" onChange={this.handleCategoryChange}/>

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

                                            <input type="number" id="min-price-value" autoComplete="off" min={minLimit} value={minPrice} onChange={this.handleMinChange}/>
                                        </label>

                                        <p className="dash">-</p>

                                        <label className="max">
                                            <p>Max</p>

                                            <input type="number" id="max-price-value" max={maxLimit} autoComplete="on" value={maxPrice} onChange={this.handleMaxChange}/>
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
                                                onChange={this.handleMinChange}
                                                className="thumb thumb-left"
                                            />

                                            <input
                                                type="range"
                                                min={minLimit}
                                                max={maxLimit}
                                                value={maxPrice}
                                                onChange={this.handleMaxChange}
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

                                            <input type="number" name="minRating" id="min-rating-value" autoComplete="off" min="0" max={maxRating} value={minRating} onChange={this.handleRatingChange}/>
                                        </label>

                                        <p className="dash">-</p>

                                        <label className="max">
                                            <p>Max</p>

                                            <input type="number" name="maxRating" id="max-rating-value" min={minRating} max="5" autoComplete="off" value={maxRating} onChange={this.handleRatingChange}/>
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
                                            <input type="checkbox" value="new" className="advanced-filter-condition-checkbox checkbox" onChange={this.handleConditionChange}/>

                                            <p>New</p>
                                        </label>

                                        <p>{ counterMap.get("new") }</p>
                                    </div>

                                    <div className="checkbox-container">
                                        <label>
                                            <input type="checkbox" value="used" className="advanced-filter-condition-checkbox checkbox" onChange={this.handleConditionChange}/>

                                            <p>Used</p>
                                        </label>

                                        <p>{ counterMap.get("used") }</p>
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
                                this.applyFilters()
                            }}>
                                <p>Apply Filters</p>
                            </div>
                        </footer>
                    </div>
                </div>

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
                            <div className="product" key={product["product_id"]}>
                                {this.createStarsForProduct(product)}
                                <div className="product-image-container">
                                    <img src={product["product_images"][0]} />
                                </div>

                                <div className="product-details">
                                    <p className="product-name">{product["product_name"]}</p>

                                    <div className="product-rating">
                                        {this.createStarsForProduct(product["product_rating"])}

                                        <p>{product["no_of_ratings"]}</p>
                                    </div>

                                    {product["stock_quantity"] < 15 ? (
                                        <p className="stock-notice">Only {product["stock_quantity"]} left!</p>
                                    ) : null
                                    }

                                    <div className="product-bottom-section">
                                        <p>€{product["price"]}</p>

                                        <div className="add-to-shopping-cart-button">
                                            <img src="/images/shopping-cart.png" alt="Add to shopping cart button" />
                                        </div>
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
}
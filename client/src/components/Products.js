import React, { Component } from "react"

export default class Products extends Component {
    createStarsForProduct(rating) {
        // Because JSX doesn't allow for-loops, use Array.from that runs 'product_rating rounded down' times to create a star image
        // Condition '_' is there because I'm not accessing a particular element
        return Array.from({ length: Math.floor(rating) }, (_, i) => (
            <img key={i} src="/images/filled-star-icon.png" alt="" />
        ))
    }

    componentDidMount() {
        this.props.switchProductViewImage(this.props.currentView) // This is so that when Products is mounted again later when it was originally in list view, it won't revert back to a grid view with the icon not changing either
    }

    render() {
        const { filteredProducts, currentView, switchProductViewImage } = this.props

        return (
            <div className="products-page-container">
                <div className="filter-tools">
                    <div className="left">
                        <div className="filter-button">
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

                {filteredProducts.length > 0 ? (
                    <main id="products-section">
                        {filteredProducts.map(product =>
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
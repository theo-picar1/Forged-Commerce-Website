import React, { Component } from "react"

export default class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gridView: true
        }
    }

    switchProductViewImage(view) {
        this.setState(prevState => ({
            gridView: !prevState.gridView
        }), () => {
            this.switchProductView(view)
        })
    }

    switchProductView(view) {
        let products = document.getElementById("products-section")
        let cards = document.getElementsByClassName("product")
        let imageContainers = document.getElementsByClassName("product-image-container")
        let addToCartBtn = document.getElementsByClassName("add-to-shopping-cart-button")

        if (view === "list") {
            products.style.display = "flex"
            products.style.flexDirection = "column"
            products.style.gap = "10px" 

            Array.from(cards).map(card => {
                card.style.display = "flex"
                card.style.flexDirection = "row"
                card.style.gap = "15px"
                card.style.backgroundColor = "#ffffff"
                card.style.padding = "15px"
            })

            Array.from(imageContainers).map(container => {
                container.style.borderRadius = "0"
                container.style.width = "150px"
                container.style.height = "inherit"
                container.style.aspectRatio = null

                let image = container.querySelector("img")

                image.style.width = "30px"
            })

            Array.from(addToCartBtn).map(button => {
                button.style.borderRadius = "50%"
                button.style.width = "40px"
                button.style.height = "40px"
                button.style.padding = "0"
            })
        }
        else {
            products.style.display = "grid"

            Array.from(cards).map(card => {
                card.style.flexDirection = "column"
                card.style.gap = "5px"
                card.style.backgroundColor = "#f3f3f3"
                card.style.padding = "0"
            })

            Array.from(imageContainers).map(container => {
                container.style.borderRadius = "10px"
                container.style.aspectRatio = "145 / 150"
                container.style.height = "auto"
                container.style.width = "100%";

                let image = container.querySelector("img")

                image.style.width = "75px"
            })

            Array.from(addToCartBtn).map(button => {
                button.style.borderRadius = "5px"
                button.style.width = "50px"
                button.style.height = "auto"
                button.style.padding = "5px 0"
            })
        }
    }

    createStarsForProduct(rating) {
        // Because JSX doesn't allow for-loops, use Array.from that runs 'product_rating rounded down' times to create a star image
        // Condition '_' is there because I'm not accessing a particular element
        return Array.from({ length: Math.floor(rating) }, (_, i) => (
            <img key={i} src="/images/filled-star-icon.png" alt="" />
        ))
    }
    render() {
        const { products } = this.props
        const { gridView } = this.state

        return (
            <div className="products-page-container">
                <h6>Search results for ""</h6>

                <div className="filter-tools">
                    <div className="left">
                        <div className="filter-button">
                            <img src="/images/filter-icon.png" alt="Filter icon button" />

                            <p>Filters</p>
                        </div>
                    </div>

                    <div className="right">
                        <select>
                            <option selected disabled>Sort by</option>
                            <option>Whatever</option>
                        </select>

                        {gridView ? (
                            <img src="/images/list-icon.png" alt="Change to list view icon" onClick={() => this.switchProductViewImage("list")} />
                        ) : (
                            <img src="/images/grid-icon.png" alt="Change to grid view icon" onClick={() => this.switchProductViewImage("grid")} />
                        )
                        }
                    </div>
                </div>

                <main id="products-section">
                    {products.map(product =>
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
            </div>
        )
    }
}
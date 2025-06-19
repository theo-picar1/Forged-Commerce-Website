import React from "react"
import { Link } from "react-router-dom"

import { Product } from "../types/Product"

// Interface is mainly for props apparently 
interface HomeProductsProps {
    products: Product[]
}

function discountedPrice(price: number, discount: number) {
    let originalPrice = price
    let convertedDiscount = discount / 100

    return (originalPrice - (price * convertedDiscount)).toFixed(2)
}

// Function that just returns the html format of the product card so that I don't need to copy and paste this chunk of code multiple times
function productCard(product: Product) {
    return (
        <div className="product" key={product["_id"]}>
            <div className="product-image-container">
                <img src={product["product_images"][0]} alt="" />
            </div>

            <div className="product-details">
                <div className="product-name-container">
                    <Link to={`/product/${product._id}`} className="product-name">{product["product_name"]}</Link>
                </div>
                {product["discount"] > 0 ? (
                    <div className="discounted-price-container">
                        <p className="product-price">€{discountedPrice(product["price"], product["discount"])}</p>
                        <p className="original-price">€{product["price"]}</p>
                    </div>
                ) : <p className="product-price">€{product["price"]}</p>
                }
            </div>
        </div>
    )
}

const HomeProducts: React.FC<HomeProductsProps> = ({
    products
}) => {
    return (
        <div className="home-products-container">
            <div className="best-sellers-section product-section">
                <h4>Best Sellers</h4>

                <div className="best-sellers horizontal-product-scroll">
                    {products.map(product =>
                        product["sold"] > 250 ? productCard(product) : null
                    )}
                </div>

                <p className="see-more">See more</p>
            </div>

            <div className="hr-ad-banner" style={{ backgroundImage: "url('/images/gym-products-background.jpeg')" }}>
                <div>
                    <p>High Quality Gym Products</p>
                </div>
            </div>

            <div className="product-deals-section product-section">
                <h4>Discounted Products</h4>

                <div className="horizontal-product-scroll">
                    {products.map(product =>
                        product["discount"] && product["discount"] > 0 ? productCard(product) : null
                    )}
                </div>
            </div>

            <div className="brand-new-products product-section">
                <h4>Brand New Products</h4>

                <div className="horizontal-product-scroll">
                    {products.map(product =>
                        product["brand_new"] ? productCard(product) : null
                    )}
                </div>
            </div>

            <div className="categories-section product-section">
                <h4>Our Categories</h4>

                <div className="categories-grid-container">
                    <div className="category" style={{ backgroundImage: `url('/images/barbell-background.jpg')` }}>
                        <div>
                            <p>Barbells</p>
                        </div>
                    </div>

                    <div className="category" style={{ backgroundImage: `url('/images/dumbbell-background.webp')` }}>
                        <div>
                            <p>Dumbbells</p>
                        </div>
                    </div>

                    <div className="category" style={{ backgroundImage: `url('/images/kettlebells-background.jpeg')` }}>
                        <div>
                            <p>Kettlebells</p>
                        </div>
                    </div>

                    <div className="category" style={{ backgroundImage: `url('/images/supplements-background.jpeg')` }}>
                        <div>
                            <p>Supplements</p>
                        </div>
                    </div>

                    <div className="category" style={{ backgroundImage: `url('/images/gym-clothing-background.jpeg')` }}>
                        <div>
                            <p>Clothing</p>
                        </div>
                    </div>

                    <div className="category" style={{ backgroundImage: `url('/images/equipment-background.jpeg')` }}>
                        <div>
                            <p>Other</p>
                        </div>
                    </div>
                </div>

                <p className="see-more">See more</p>
            </div>

            <div className="no-more-to-see-section">
                <a href="#top">
                    <img src="/images/red-up-arrow.png" alt="" />
                </a>

                <p>No more products to see!</p>
            </div>
        </div>
    )
}

export default HomeProducts
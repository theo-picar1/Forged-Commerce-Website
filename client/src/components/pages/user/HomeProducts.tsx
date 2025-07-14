import React from "react"

// types
import { Product } from "../../../types/Product"

// functions
import { createProductCard } from "../../../utils/product-utils"

// global constants
import { ACCESS_LEVEL_ADMIN } from "../../../config/global_constants"
import { Navigate } from "react-router-dom"

// Interface is mainly for props apparently 
interface HomeProductsProps {
    products: Product[]
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
                        product["sold"] > 250 ? createProductCard(product) : null
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
                        product["discount"] && product["discount"] > 0 ? createProductCard(product) : null
                    )}
                </div>
            </div>

            <div className="brand-new-products product-section">
                <h4>Brand New Products</h4>

                <div className="horizontal-product-scroll">
                    {products.map(product =>
                        product["brand_new"] ? createProductCard(product) : null
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
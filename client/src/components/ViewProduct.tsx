import React, { useState, useEffect, JSX } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { Product } from "../types/Product"

interface ViewProductsProps {
    products: Product[]
    addProductToCart: (product: Product) => void
    handleRequestedQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    quantityToAdd: number
    updateProductFavourite: (productId: string) => void
}

const ViewProduct: React.FC<ViewProductsProps> = ({
    products,
    addProductToCart,
    handleRequestedQuantityChange,
    quantityToAdd,
    updateProductFavourite
}) => {
    const { id } = useParams<{ id: string }>()

    const [product, setProduct] = useState<Product | null>(null)
    const [similarProducts, setSimilarProducts] = useState<Product[]>([])

    const addToFavourites = async (productId: string): Promise<void> => {
        try {
            const res = await axios.post(`${SERVER_HOST}/favourites/${localStorage.id}/${productId}`)

            if (!res) {
                console.log("Unable to perform request at the moment!")

                return
            }
            else {
                console.log(res.data.message)

                // Set the boolean field 'favourite' to be either true or false, depending if user removes or adds product to favourites
                updateProductFavourite(productId)

                // Locally updating product's 'favourite' boolean so UI also updates immediately
                // Check all products and check to see if their favourite field is the same before
                setProduct(prev => prev ? { ...prev, favourite: !prev.favourite } : prev)

                return
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.log(error)
            }
        }
    }

    // the little circles just below the product image depending on ow many images that product has
    function createImageIndexes(noOfImages: number): JSX.Element[] {
        return Array.from({ length: noOfImages }, (_, i) => (
            <div className="index" key={i}></div>
        ))
    }

    // To calculate discounted price and also return it rounded to two d.p
    function discountedPrice(price: number, discount: number): number {
        let originalPrice = price
        let convertedDiscount = discount / 100

        return Number((originalPrice - price * convertedDiscount).toFixed(2))
    }

    // Findall products where the first category of the product is the same as product we're viewing
    function findSimilarProducts() {
        let similar: Product[] = []

        products.forEach((p) => {
            if (p.category[0] === product?.category[0] && p._id !== product?._id) {
                similar.push(p)
            }
        })

        setSimilarProducts(similar)
    }

    useEffect(() => {
        // Fetch the product to view with the help of the id in the url
        async function fetchProduct() {
            try {
                const res = await axios.get<Product>(`${SERVER_HOST}/products/${id}`)

                if (res) {
                    setProduct(res.data)
                    console.log(res.data)
                }
                else {
                    console.log("Failed to retrieve product")
                }
            } catch (error: any) {
                console.error("Unexpected error:", error)
            }
        }

        fetchProduct()
    }, [id]) // Whenever id changes, run this again. Pretty much reload component

    // Also findSimilarProducts whenever product or products change when component mounts
    useEffect(() => {
        if (product) {
            findSimilarProducts()
        }
    }, [product, products])

    return product ? (
        <div className="view-product-page-container">
            <div className="image-carousel-container">
                <div className="image-carousel">
                    <div className="image-container">
                        {product.product_images.map((url, i) => (
                            <div key={i} style={{ backgroundImage: `url(${url})` }}></div>
                        ))}
                    </div>
                </div>

                <div className="image-index">{createImageIndexes(product.product_images.length)}</div>
            </div>

            <div className="product-details">
                <h4>{product.product_name}</h4>

                <div className="price-and-stock">
                    <h5>€{product.price}</h5>
                    <p>{product.stock_quantity} in stock</p>
                </div>

                <div className="product-quantity-container">
                    <p>Quantity</p>

                    <input
                        type="number"
                        min={1}
                        max={product.stock_quantity}
                        placeholder="Enter quantity here"
                        value={quantityToAdd}
                        onChange={handleRequestedQuantityChange}
                    />
                </div>

                <div className="buttons">
                    <button id="buy-now" className="button">
                        Buy now
                    </button>

                    <button id="add-to-basket" className="button" onClick={() => addProductToCart(product)}>
                        Add to basket
                    </button>

                    {product.favourite ? (
                        <div id="add-to-favourites" className="button favourited" onClick={() => addToFavourites(product._id)}>
                            <img src="/images/favourite-icon.png" />

                            <p>Remove from favourites</p>
                        </div>
                    ) : (
                        <div id="add-to-favourites" className="button not-favourited" onClick={() => addToFavourites(product._id)}>
                            <img src="/images/favourite-icon.png" />

                            <p>Add to favourites</p>
                        </div>
                    )}
                </div>

                <div className="about-this-product">
                    <h3>About this product</h3>

                    <div className="about-content">
                        <div className="theos-row">
                            <p className="title">Condition</p>

                            <p>{product.brand_new ? "New" : "Used"}</p>
                        </div>

                        <div className="theos-row">
                            <p className="title">Quantity</p>

                            <div className="sold-and-stock">
                                <p className="detail sold-detail">{product.sold} sold!</p>
                                <p className="detail">{product.stock_quantity} left</p>
                            </div>
                        </div>

                        <div className="theos-row">
                            <p className="title">Average Rating</p>

                            <p className="detail">{product.product_rating} stars</p>
                        </div>

                        <div className="theos-row">
                            <p className="title">No. Of Reviews</p>

                            <p className="detail">{product.no_of_reviews}</p>
                        </div>
                    </div>
                </div>

                <div className="description">
                    <h3>Description</h3>

                    {product.description}
                </div>
            </div>

            <div className="similar-products">
                <h3>Similar Products</h3>

                <div className="products">
                    {similarProducts.length > 0 ? (
                        similarProducts.map((product) => (
                            <div
                                className="product"
                                key={product._id}
                                onClick={() => {
                                    findSimilarProducts()
                                }}
                            >
                                <div className="product-image-container">
                                    <img src={product.product_images[0]} alt="" />
                                </div>

                                <div className="product-details">
                                    <div className="product-name-container">
                                        <p className="product-name">{product.product_name}</p>
                                    </div>

                                    {product.discount > 0 ? (
                                        <div className="discounted-price-container">
                                            <p className="product-price">{`€${discountedPrice(product.price, product.discount)}`}</p>

                                            <p className="original-price">€{product.price}</p>
                                        </div>
                                    ) : (
                                        <p className="product-price">€{product.price}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No similar products</p>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div>Error 404: Product not found</div>
    )
}

export default ViewProduct

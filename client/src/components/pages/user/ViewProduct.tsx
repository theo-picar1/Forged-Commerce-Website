import React, { useState, useEffect, JSX } from "react"
import { Link, useParams } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from "../../../config/global_constants"

// types
import { Product } from "../../../types/Product"

// functions
import { createImageIndexes, discountedPrice, findSimilarProducts } from "../../../utils/product-utils"

// hooks
import { useFetchFavourites } from "../../../hooks/favourites/useFetchFavourites"
import { useRemoveFavourite } from "../../../hooks/favourites/useRemoveFavourite"
import { useAddFavourite } from "../../../hooks/favourites/useAddFavourite"
import { useFetchOneProduct } from "../../../hooks/products/useFetchOneProduct"

interface ViewProductsProps {
    products: Product[]
    addProductToCart: (product: Product) => void
    handleRequestedQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    quantityToAdd: number
}

const ViewProduct: React.FC<ViewProductsProps> = ({
    products,
    addProductToCart,
    handleRequestedQuantityChange,
    quantityToAdd
}) => {
    // For the id that is in the URL for ViewProduct
    const { id } = useParams<{ id: string }>()

    // State variables
    const [similarProducts, setSimilarProducts] = useState<Product[]>([])

    // Hook state variables 
    const { favourites, loading, error, fetchFavourites } = useFetchFavourites(localStorage.id)
    const { favourites: updatedFavourites, removeFromFavourites } = useRemoveFavourite()
    const { favourites: addedFavourites, addToFavourites } = useAddFavourite()
    const { product } = useFetchOneProduct(id ?? "")

    // Find all similar products on mount and when id changes
    useEffect(() => {
        if (product) {
            const similar = findSimilarProducts(products, product)

            setSimilarProducts(similar)
        }
    }, [id])

    // Remove product from user's favourites and update
    const removeAndUpdateFavourites = async (productId: string) => {
        try {
            await removeFromFavourites(localStorage.id, productId)

            await fetchFavourites() // Update state
        }
        catch {
            alert("Failed to remove from favourites")
        }
    }

    // Add product to favoruites and update
    const addAndUpdateFavourites = async (productId: string) => {
        try {
            await addToFavourites(localStorage.id, productId)

            await fetchFavourites() // Update state
        }
        catch {
            alert("Failed to add product to favourites")
        }
    }

    return product ? (
        <div className="view-product-page-container">
            {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
                <div className="admin-tools">
                    <Link to={`/edit-product/${id}`} className="edit admin-button">
                        <p>Edit product</p>
                    </Link>

                    <div className="delete admin-button">
                        <p>Delete product</p>
                    </div>
                </div>
            ) : null}

            <div className="image-carousel-container">
                <div className="image-carousel">
                    <div className="image-container">
                        {product.product_images.map((url, i) => {
                            // Logic to take into account url's that were just copy and pasted from the web by me
                            const isFullUrl = url.startsWith('http://') || url.startsWith('https://')
                            const src = isFullUrl ? url : `${SERVER_HOST}/uploads/${url}`

                            return <img key={i} src={src} />
                        })}
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

                    {/* Checking if viewed product is in user's favourites */}
                    {favourites.some(fav => fav._id === product._id) ? (
                        <div id="add-to-favourites" className="button favourited" onClick={() => removeAndUpdateFavourites(product._id)}>
                            <img src="/images/favourite-icon.png" />

                            <p>Remove from favourites</p>
                        </div>
                    ) : (
                        <div id="add-to-favourites" className="button not-favourited" onClick={() => addAndUpdateFavourites(product._id)}>
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
                            <div className="product" key={product._id}>
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
        <div>No matching product!</div>
    )
}

export default ViewProduct

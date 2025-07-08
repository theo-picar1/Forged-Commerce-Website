import React, { useState, useEffect, JSX } from "react"
import { Link, useParams } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from "../../../config/global_constants"

// types
import { Product } from "../../../types/Product"
import { Favourite } from "../../../types/Favourite"

import { createImageIndexes, discountedPrice } from "../../../utils/product-utils"

interface ViewProductsProps {
    products: Product[]
    userFavourites: Favourite | null
    addProductToCart: (product: Product) => void
    handleRequestedQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    quantityToAdd: number
    removeFavourite: (productId: string) => void
    refreshFavourites: (productId: string, condition: string, productToAdd: Product) => void
}

const ViewProduct: React.FC<ViewProductsProps> = ({
    products,
    userFavourites,
    addProductToCart,
    handleRequestedQuantityChange,
    quantityToAdd,
    removeFavourite,
    refreshFavourites
}) => {
    // For the id that is in the URL for ViewProduct
    const { id } = useParams<{ id: string }>()

    const [product, setProduct] = useState<Product | null>(null)
    const [similarProducts, setSimilarProducts] = useState<Product[]>([])
    const [favouriteProducts, setFavouritedProducts] = useState<string[]>([])

    const addToFavourites = async (productId: string, productToAdd: Product): Promise<void> => {
        try {
            const res = await axios.post(`${SERVER_HOST}/favourites/${localStorage.id}/${productId}`)

            if (!res || !res.data) {
                alert("Unable to perform request at the moment!")

                return
            }
            else {
                alert(res.data.message)

                refreshFavourites(productId, "add", productToAdd)

                return
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                alert(error.response.data.errorMessage)
            }
            else {
                console.log("Unexpected server error: ", error)
            }
        }
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

    // Fetch product by id in URL
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axios.get<Product>(`${SERVER_HOST}/products/${id}`)

                if (res) {
                    setProduct(res.data)
                }
                else {
                    alert("Failed to retrieve product")
                }

                return
            } 
            catch (error: any) {
                console.error("Unexpected error:", error)
                return
            }
        }

        fetchProduct()
    }, [id]) // Whenever id changes, run this again. Pretty much reload component

    // Also findSimilarProducts whenever product or products change when component mounts
    useEffect(() => {
        if (product) {
            findSimilarProducts()
        }
    }, [id])

    // To find all products that are favourited for UI purposes
    useEffect(() => {
        let favourited: string[] = []

        userFavourites?.favourites.forEach(favourite => {
            favourited.push(favourite._id)
        })

        setFavouritedProducts(favourited)
    }, [userFavourites])

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

                    {favouriteProducts.includes(product._id) ? (
                        <div id="add-to-favourites" className="button favourited" onClick={() => removeFavourite(product._id)}>
                            <img src="/images/favourite-icon.png" />

                            <p>Remove from favourites</p>
                        </div>
                    ) : (
                        <div id="add-to-favourites" className="button not-favourited" onClick={() => addToFavourites(product._id, product)}>
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
        <div>No matching product!</div>
    )
}

export default ViewProduct

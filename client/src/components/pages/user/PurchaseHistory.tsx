import React from "react"
import { Navigate, useParams } from "react-router-dom"

// functions 
import { formatDate } from "../../../utils/string-utils.ts"

// hooks
import { useFetchHistory } from "../../../hooks/history/useFetchHistory.tsx"

// global constants
import { ACCESS_LEVEL_ADMIN } from "../../../config/global_constants.ts"

const PurchaseHistory: React.FC = () => {
    // Variables
    const isAdmin = parseInt(localStorage.accessLevel) === ACCESS_LEVEL_ADMIN
    const { userId } = useParams<{userId?: string}>()

    // Hook variables
    const { purchases, loading, error } = useFetchHistory(isAdmin ? userId : localStorage.id) // Use id in URL if admin is accessing user's purchase hstory

    return (
        <div className="purchase-history-page">
            {loading ? (
                <div className="onmount-message">
                    <p>Loading history...</p>
                </div>
            ) : error ? (
                <div className="onmount-message">
                    <p>An error has occured. Please refresh the page</p>
                </div>
            ) : (
                <div className="purchases">
                    {purchases && purchases.length > 0 ? (
                        purchases.map(purchase => (
                            <div className="purchase" key={purchase._id}>
                                <div className="header">
                                    <div className="order-id">
                                        <p>Order:</p>
                                        <p>{purchase._id}</p>
                                    </div>

                                    <div className="order-details">
                                        <div>
                                            <p className="title">Date:</p>
                                            <p className="detail">{formatDate(purchase.purchased_at)}</p>
                                        </div>

                                        <div>
                                            <p className="title">Total:</p>
                                            <p className="detail">€{purchase.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="purchased-items">
                                    {purchase.items.map(item => (
                                        <div className="purchased-item" key={item._id}>
                                            <div className="product-images">
                                                <img src={item.product_images[0]} className="image" />
                                            </div>

                                            <div className="product-details">
                                                <div>
                                                    <p className="name">{item.product_name}</p>
                                                    <p className="price-and-quantity">
                                                        €{item.price} x {item.quantity}
                                                    </p>
                                                </div>

                                                <button className="view-product">View Product</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No previous purchases made</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default PurchaseHistory
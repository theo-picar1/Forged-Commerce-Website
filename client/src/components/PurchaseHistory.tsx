import React, { useEffect, useState } from "react"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants.ts"
import { History } from "../types/Purchases.ts"

/*
    Notes:
    1. Functions that don't need access to props, state or variabes defined in the component are best done outside for performance tings
    2. Use 'const' for arrow-type functions and 'function' for just regular functions
*/

// To add the corresponding suffix bit to a day depending on what day it is i.e 1 = 1st
function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
    }
}

// Function to return a Date object into a format like 14th January, 2025 
function formatDate(dateString: Date): string {
    const date = new Date(dateString)
    const day = date.getDate()
    const suffix = getOrdinalSuffix(day)

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    return `${day}${suffix} ${month}, ${year}`
}

// This is the equivalent of 'export default class PurchaseHistory extends Component {...}'
const PurchaseHistory: React.FC = () => {
    const [purchaseHistory, setPurchaseHistory] = useState<History | null>(null) // Same thing as this.state = {...}

    // Equivalent of componentDidMount
    useEffect(() => {
        // Can't make useEffect async so you have to define another function inside that does the axios work, and then call it inside useEffect
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${SERVER_HOST}/purchases/${localStorage.id}`)

                if (res) {
                    // Same thing as this.setState()
                    setPurchaseHistory(res.data)
                } 
                else {
                    alert("Unable to load/fetch purchase history for user")
                }
            } 
            catch (error: any) {
                if (error.response?.data?.errorMessage) {
                    console.log(error.response.data.errorMessage)
                } 
                else {
                    console.error("Unexpected error:", error)
                }
            }
        }

        fetchHistory()
    }, [])

    return (
        <div className="purchase-history-page">
            <div className="purchases">
                {purchaseHistory?.purchases.map(purchase => (
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
                ))}
            </div>
        </div>
    )
}

export default PurchaseHistory
import React, { Component } from "react"

import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"

import { History } from "../types/Purchases.ts"

type PurchaseHistoryState = {
    purchaseHistory: History | null
}

export default class PurchaseHistory extends Component<{}, PurchaseHistoryState> {
    constructor(props: {}) {
        super(props)

        this.state = {
            purchaseHistory: null
        }
    }

    // Fetch the user's purchase history when they go onto this component
    componentDidMount = async (): Promise<void> => {
        try {
            const res = await axios.get(`${SERVER_HOST}/purchases/${localStorage.id}`)

            if (res) {
                this.setState({
                    purchaseHistory: res.data
                })
            }
            else {
                alert("Unable to load/fetch purchase history for user")
            }
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.log(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error:", error)
            }
        }
    }

    // To determine what suffix the provided day needs
    getOrdinalSuffix(day: number): string {
        if (day > 3 && day < 21) return 'th' // special case for 11th, 12th, 13th

        switch (day % 10) {
            case 1: return 'st'
            case 2: return 'nd'
            case 3: return 'rd'
            default: return 'th'
        }
    }

    // Just a helper function to format new Date object into the DD/MM/YYYY
    formatDate(dateString: Date): string {
        const date = new Date(dateString)
        const day = date.getDate()
        const suffix = this.getOrdinalSuffix(day)

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const month = monthNames[date.getMonth()]
        const year = date.getFullYear()

        return `${day}${suffix} ${month}, ${year}`
    }

    render() {
        return (
            <div className="purchase-history-page">
                <div className="purchases">
                    {this.state.purchaseHistory?.purchases.map(purchase =>
                        <div className="purchase" key={purchase._id}>
                            <div className="header">
                                <div className="order-id">
                                    <p>Order:</p>

                                    <p>{purchase._id}</p>
                                </div>

                                <div className="order-details">
                                    <div>
                                        <p className="title">Date:</p>

                                        <p className="detail">{this.formatDate(purchase.purchased_at)}</p>
                                    </div>

                                    <div>
                                        <p className="title">Total:</p>

                                        <p className="detail">€{purchase.totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="purchased-items">
                                {purchase.items.map(item =>
                                    <div className="purchased-item" key={item._id}>
                                        <div className="product-images">
                                            <img src={item.product_images[0]} className="image" />
                                        </div>

                                        <div className="product-details">
                                            <div>
                                                <p className="name">{item.product_name}</p>

                                                <p className="price-and-quantity">€{item.price} x {item.quantity}</p>
                                            </div>

                                            <button className="view-product">View Product</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
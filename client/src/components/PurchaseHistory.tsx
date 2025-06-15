import React, { Component } from "react"

import { SERVER_HOST } from "../config/global_constants.ts"
import axios from "axios"

import { History } from "../types/Purchases.ts"
import { RouteComponentProps } from "react-router-dom"

type PurchaseHistoryState = {
    purchaseHistory: History | null
}

type PurchaseHistoryProps = RouteComponentProps

export default class PurchaseHistory extends Component<PurchaseHistoryProps, PurchaseHistoryState> {
    constructor(props: PurchaseHistoryProps) {
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
                console.log("Successfully loaded purchase history for user")

                this.setState({
                    purchaseHistory: res.data
                }, () => console.log(this.state.purchaseHistory))
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

    render() {
        return (
            <div className="purchase-history-page">
                {/* {this.state.purchaseHistory?.purchases.map(purchase =>
                    <div className="purchase">
                        <p className="purchase-date">date</p>

                        <div className="purchased-items">
                            {purchase.cart.products.map(cartProduct =>
                                <div className="product">
                                    <h1>{cartProduct.product.product_name}</h1>
                                </div>
                            )}
                        </div>
                    </div>
                )} */}
            </div>
        )
    }
}
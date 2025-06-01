import React, { Component } from "react"
import { Product } from "../types/Product"
import { Cart } from "../types/Cart"
import { Link } from "react-router-dom"

type ShoppingCartState = {
    cart: Cart | null
}

interface ShoppingCartProps {
    products: Product[]
    categories: string[]
    capitiliseString: (input: string) => string
}

export default class ShoppingCart extends Component<ShoppingCartProps, ShoppingCartState> {
    constructor(props: ShoppingCartProps) {
        super(props)

        this.state = {
            cart: null
        }
    }

    render() {
        const { cart } = this.state

        return (
            cart === null ? (
                <div className="empty-shopping-cart">
                    <h3>Shopping Cart</h3>

                    <h4>You currently have no items in your cart!</h4>

                    <Link to={"/"} className="look-for-items">Look for items!</Link>
                </div>
            ) : (
                <div className="filled-shopping-cart">
                    <h3>Filled shopping cart</h3>
                </div>
            )
        )
    }
}

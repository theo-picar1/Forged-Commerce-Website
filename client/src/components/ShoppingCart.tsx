import React, { Component } from "react"
import { CartProducts } from "../types/Cart"
import { Product } from "../types/Product"
import { Link } from "react-router-dom"

interface ShoppingCartProps {
    cartProducts: CartProducts[]
    categories: string[]
    capitiliseString: (input: string) => string
    setProductToView: (product: Product) => void
}

export default class ShoppingCart extends Component<ShoppingCartProps> {
    render() {
        const { cartProducts, setProductToView } = this.props

        return (
            cartProducts.length === 0 ? (
                <div className="empty-shopping-cart">
                    <h3>Shopping Cart</h3>

                    <h4>You currently have no items in your cart!</h4>

                    <Link to={"/"} className="look-for-items">Look for items!</Link>
                </div>
            ) : (
                <div className="filled-shopping-cart">
                    <div className="top-section">
                        <h3>Shopping Cart</h3>

                        <button className="proceed-to-checkout">Proceed to checkout ({cartProducts.length})</button>
                    </div>

                    <div className="cart-products-section">
                        {cartProducts.map(cartProduct =>
                            <div className="cart-product" key={cartProduct.product._id}>
                                <div className="product-details">
                                    <div className="left">
                                        <div className="image-container" onClick={() => setProductToView(cartProduct.product)}>
                                            <img src={cartProduct.product.product_images[0]} alt="" />
                                        </div>
                                    </div>

                                    <div className="right">
                                        <p className="product-name">{ cartProduct.product.product_name }</p>
                                        <h3 className="product-price">€{ cartProduct.product.price }</h3>
                                        <p className="product-stock">{ cartProduct.product.stock_quantity } available</p>
                                    </div>
                                </div>

                                <div className="product-buttons">
                                    <div className="edit-quantity-section">
                                        -

                                        <p>{ cartProduct.quantity }</p>

                                        +
                                    </div>

                                    <button className="remove-button">Remove product</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        )
    }
}

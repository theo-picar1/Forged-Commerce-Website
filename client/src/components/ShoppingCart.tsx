import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

// types
import { Cart } from "../types/Cart"
import { Product } from "../types/Product"

interface ShoppingCartProps {
    updateCartLength: (newLength: number) => void
}

// type ShoppingCartState = {
//     cart: Cart | null
//     originalCart: Cart | null
//     changedQuantity: boolean
//     totalPrice: number
// }

const ShoppingCart: React.FC<ShoppingCartProps> = ({
    updateCartLength
}) => {
    const [cart, setCart] = useState<Cart | null>(null)
    const [originalCart, setOriginalCart] = useState<Cart | null>(null)
    const [changedQuantity, setChangedQuantity] = useState<boolean>(false) // This is to determine whether or not the save butto becomes clickable or not
    const [totalPrice, setTotalPrice] = useState<number>(0)

    // Function that acts as both a data retriever and an updater
    const fetchCart = async (): Promise<void> => {
        // For getting the user's cart items only if the user has logged in
        if (localStorage.id != null || localStorage.id != undefined) {
            try {
                const res = await axios.get<Cart>(`${SERVER_HOST}/cart/${localStorage.id}`)

                if (!res.data || res.data == null) {
                    alert("No matching cart for user found!")
                    return
                }

                localStorage.cartId = res.data._id

                let total: number = 0

                // Get the total by foreaching every product and adding (product's price * quantity) to total
                res.data.products.forEach(product => {
                    total += (product.product.price * product.quantity)
                })

                // So that it is always two decimal places
                total = parseFloat(total.toFixed(2))

                setCart(res.data)
                setOriginalCart(res.data)
                setTotalPrice(total)
            }
            catch (error) {
                console.error("Id is not defined, I think? ", error)
            }
        }
    }

    // Get cart data first
    useEffect(() => {
        fetchCart()
    }, [cart])

    // Self-explanatory
    const deleteProductFromCart = async (productId: string): Promise<void> => {
        try {
            const res = await axios.delete(`${SERVER_HOST}/cart/${localStorage.id}/${productId}`)

            if (res) {
                alert("Product deleted!")

                fetchCart()
                updateCartLength(res.data.updatedLength)
            }
            else {
                alert("Product was not deleted")
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

    // Button that will save all quantity changes to all products in the cart by just replacing the old mongo cart products with the newly updated one
    const saveEditedQuantity = async (): Promise<void> => {
        if (!cart) return

        const updatedProducts = cart.products

        try {
            const res = await axios.put(`${SERVER_HOST}/cart/${localStorage.id}`, { products: updatedProducts })

            if (res) {
                alert("Changes have been successfully saved!")

                setChangedQuantity(changedQuantity)
                fetchCart()
            }
            else {
                alert("Changes were not saved. Please try again!")
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

    // Handles requested quantity change when user clicks the add or subtract buttons
    const handleQuantityChangeByButton = (product: Product, action: 'add' | 'subtract'): void => {
        const updatedCart = { ...cart } as Cart

        updatedCart.products = updatedCart.products.map(cartProduct => {
            if (cartProduct.product._id === product._id) {
                let newQuantity = cartProduct.quantity

                // Making sure if user adds it doesn't go above available stock, and it doesn't go below 1 if subtracting
                if (action === 'add' && newQuantity < cartProduct.product.stock_quantity) {
                    newQuantity += 1
                }
                else if (action === 'subtract' && newQuantity > 1) {
                    newQuantity -= 1
                }

                return {
                    ...cartProduct,
                    quantity: newQuantity
                }
            }
            return cartProduct
        })

        // Check for any quantity changes by using some operator which will return true as long as at least one product quantity does not match
        const originalProducts = originalCart?.products || []
        const edited = updatedCart.products.some(updated =>
            originalProducts.find(original => original.product._id === updated.product._id)?.quantity !== updated.quantity
        )

        setCart(updatedCart)
        setChangedQuantity(edited)
    }

    // To post all items the user has in their cart to their purchase history
    const checkoutItems = async (): Promise<void> => {
        if (localStorage.cartId && localStorage.cartId !== undefined) {
            try {
                const res = await axios.post(`${SERVER_HOST}/purchases/${localStorage.id}`, { cartId: localStorage.cartId, totalPrice: totalPrice })

                if (res) {
                    alert("Successfully checked out")

                    fetchCart()
                    updateCartLength(0)

                    return
                }
                else {
                    alert("Failed to check out items!")
                    return
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
    }

    return (
        !cart || cart.products.length === 0 ? (
            <div className="empty-shopping-cart">
                <h3>Shopping Cart</h3>

                <h4>You currently have no items in your cart!</h4>

                <Link to={"/"} className="look-for-items">Look for items!</Link>
            </div>
        ) : (
            <div className="filled-shopping-cart">
                <div className="top-section">
                    <h3>Shopping Cart</h3>

                    <div className="buttons-section">
                        <button className="proceed-to-checkout" onClick={() => checkoutItems()}>Proceed to checkout ({cart.products.length})</button>

                        {changedQuantity ? (
                            <button className="save-changes" onClick={() => saveEditedQuantity()}>Save</button>
                        ) : (
                            <button className="disabled-save-changes">Save</button>
                        )}
                    </div>
                </div>

                <div className="cart-products-section">
                    <h4>Total: €{totalPrice}</h4>
                    {cart.products.map(cartProduct =>
                        <Link to={`/product/${cartProduct.product._id}`} className="cart-product" key={cartProduct.product._id}>
                            <div className="product-details">
                                <div className="left">
                                    <div className="image-container">
                                        <img
                                            src={
                                                // Check to see if image url was one from the web or not
                                                cartProduct.product.product_images[0].startsWith('http://') ||
                                                    cartProduct.product.product_images[0].startsWith('https://')
                                                    ? cartProduct.product.product_images[0]
                                                    : `${SERVER_HOST}/uploads/${cartProduct.product.product_images[0]}`
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className="right">
                                    <p className="product-name">{cartProduct.product.product_name}</p>
                                    <h3 className="product-price">€{cartProduct.product.price}</h3>
                                    <p className="product-stock">{cartProduct.product.stock_quantity} available</p>
                                </div>
                            </div>

                            <div className="product-buttons">
                                <div className="edit-quantity-section">
                                    <button className="subtract" onClick={() => handleQuantityChangeByButton(cartProduct.product, "subtract")}>-</button>

                                    <input className="quantity" type="text" value={cartProduct.quantity} readOnly />

                                    <button className="add" onClick={() => handleQuantityChangeByButton(cartProduct.product, "add")}>+</button>
                                </div>

                                <div className="remove-button" onClick={() => deleteProductFromCart(cartProduct.product._id)}>
                                    <img src="/images/bin-icon.png" />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        )
    )
}

export default ShoppingCart

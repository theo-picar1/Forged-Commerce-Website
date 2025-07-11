import React, { useState, useEffect } from "react"
import { Link, Navigate } from "react-router-dom"

// axios
import axios from "axios"
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from "../../../config/global_constants.ts"

// types
import { Cart } from "../../../types/Cart.ts"
import { Product } from "../../../types/Product.ts"

// hooks
import { useFetchCart } from "../../../hooks/cart/useFetchCart.tsx"
import { useDeleteProductFromCart } from "../../../hooks/cart/useDeleteProductFromCart.tsx"
import { useUpdateCartQuantity } from "../../../hooks/cart/useUpdateCartQuantity.tsx"
import { useCheckoutCart } from "../../../hooks/purchases/useCheckoutCart.tsx"

// functions 
import { calculateTotalPrice } from "../../../utils/calculation-utils.ts"

interface ShoppingCartProps {
    updateCartLength: (newLength: number) => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
    updateCartLength
}) => {
    // State variables
    const [cartCopy, setcartCopy] = useState<Cart>()
    const [isQuantityChanged, setIsQuantityChanged] = useState<boolean>(false) // This is to determine whether or not the save butto becomes clickable or not
    const [totalPrice, setTotalPrice] = useState<number>(0)

    // Variables
    const accessLevel = parseInt(localStorage.accessLevel)
    const isAdmin = accessLevel === ACCESS_LEVEL_ADMIN

    // Hook state variables
    const { cart, fetchCart } = useFetchCart(localStorage.id, isAdmin)
    const { deleteProductFromCart } = useDeleteProductFromCart()
    const { updateCartQuantities } = useUpdateCartQuantity()
    const { checkoutCart } = useCheckoutCart()

    // Change totalPrice and cartCopy if different user is loading cart
    useEffect(() => {
        if (cart) {
            setcartCopy(cart)
            setTotalPrice(calculateTotalPrice(cart))
            updateCartLength(cart.savedProducts.length)
        }
    }, [cart])

    // Delete selected product from cart and refetch the new cart
    const deleteProductAndUpdateCart = async (productId: string): Promise<void> => {
        try {
            deleteProductFromCart(localStorage.id, productId)

            fetchCart()
        }
        catch {
            console.log("Failed to delete product from cart")
        }
    }

    // Save all changed product quantites in user's cart
    const updateQuantitiesInCart = async (): Promise<void> => {
        if(!cartCopy) return 

        try {
            await updateCartQuantities(cartCopy)

            await fetchCart()

            setIsQuantityChanged(false) // Make the save button unclickable again
        }
        catch {
            console.log("Failed to update changes!")
        }
    }

    // Handles requested quantity change when user clicks the add or subtract buttons
    const handleQuantityChangeByButton = (product: Product, action: 'add' | 'subtract'): void => {
        if (!cartCopy) return

        const updatedCart = { ...cartCopy } 

        updatedCart.savedProducts = updatedCart.savedProducts.map(savedProduct => {
            if (savedProduct.product._id === product._id) {
                let newQuantity = savedProduct.quantity

                // Making sure if user adds it doesn't go above available stock, and it doesn't go below 1 if subtracting
                if (action === 'add' && newQuantity < savedProduct.product.stock_quantity) {
                    newQuantity += 1
                }
                else if (action === 'subtract' && newQuantity > 1) {
                    newQuantity -= 1
                }

                return {
                    ...savedProduct,
                    quantity: newQuantity
                }
            }
            return savedProduct
        })

        // Check for any quantity changes by using some operator which will return true as long as at least one product quantity does not match
        const originalProducts = cartCopy.savedProducts
        const edited = updatedCart.savedProducts.some(updated =>
            originalProducts.find(original => original.product._id === updated.product._id)?.quantity !== updated.quantity
        )

        setcartCopy(updatedCart)
        setIsQuantityChanged(edited)
    }

    // To post all items the user has in their cart to their purchase history
    const checkoutItemsAndUpdateCart = async (): Promise<void> => {
        if(!cart) return 
        
        try {
            await checkoutCart(localStorage.id, cart._id, totalPrice)

            await fetchCart()
        }
        catch {
            console.log("Failed to checkout items!")
        }
    }

    // Users cannot access ShoppingCart component
    if (isAdmin) {
        return <Navigate to="/admin" replace />
    }

    return (
        !cartCopy || cartCopy.savedProducts.length === 0 ? (
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
                        <button className="proceed-to-checkout" onClick={() => checkoutItemsAndUpdateCart()}>Proceed to checkout ({cartCopy.savedProducts.length})</button>

                        {isQuantityChanged ? (
                            <button className="save-changes" onClick={() => updateQuantitiesInCart()}>Save</button>
                        ) : (
                            <button className="disabled-save-changes">Save</button>
                        )}
                    </div>
                </div>

                <div className="cart-products-section">
                    <h4>Total: €{totalPrice}</h4>
                    {cartCopy.savedProducts.map(savedProduct =>
                        <div className="cart-product">
                            <div className="product-details">
                                <div className="left">
                                    <div className="image-container">
                                        <img
                                            src={
                                                // Check to see if image url was one from the web or not
                                                savedProduct.product.product_images[0].startsWith('http://') ||
                                                    savedProduct.product.product_images[0].startsWith('https://')
                                                    ? savedProduct.product.product_images[0]
                                                    : `${SERVER_HOST}/uploads/${savedProduct.product.product_images[0]}`
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>

                                <div className="right">
                                    <p className="product-name">{savedProduct.product.product_name}</p>
                                    <h3 className="product-price">€{savedProduct.product.price}</h3>
                                    <p className="product-stock">{savedProduct.product.stock_quantity} available</p>
                                </div>
                            </div>

                            <div className="product-buttons">
                                <div className="edit-quantity-section">
                                    <button className="subtract" onClick={() => handleQuantityChangeByButton(savedProduct.product, "subtract")}>-</button>

                                    <input className="quantity" type="text" value={savedProduct.quantity} readOnly />

                                    <button className="add" onClick={() => handleQuantityChangeByButton(savedProduct.product, "add")}>+</button>
                                </div>

                                <div className="remove-button" onClick={() => deleteProductAndUpdateCart(savedProduct.product._id)}>
                                    <img src="/images/bin-icon.png" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    )
}

export default ShoppingCart

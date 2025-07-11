import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

// axios
import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST } from "./config/global_constants.ts"
import axios from "axios"
import { SERVER_HOST } from "./config/global_constants.ts"

// bootstrap
import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

// All individual pages
import Home from "./components/layouts/Home.tsx"
import Admin from "./components/layouts/Admin.tsx"
import NoPageFound from "./components/pages/NoPageFound.tsx"
import Login from "./components/pages/authentication/Login.tsx"
import Register from "./components/pages/authentication/Register.tsx"
import ForgotPassword from "./components/pages/authentication/ForgotPassword.tsx"

// All pages/ views for the Home Component
import HomeProducts from "./components/pages/user/HomeProducts.tsx"
import ShoppingCart from "./components/pages/user/ShoppingCart.tsx"
import Products from "./components/pages/user/Products.tsx"
import ViewProduct from "./components/pages/user/ViewProduct"
import PurchaseHistory from "./components/pages/user/PurchaseHistory.tsx"
import Favourites from "./components/pages/user/Favourites.tsx"
import AdminLogin from "./components/pages/authentication/AdminLogin.tsx"
import EditProduct from "./components/pages/admin/EditProduct.tsx"
import Users from "./components/pages/admin/Users.tsx"

// All pages / views for Admin component
import AddProduct from "./components/pages/admin/AddProduct.tsx"

// Types
import { Product } from "./types/Product.ts"

// Functions 
import { countCategoriesAndConditions, getCategories } from "./utils/product-utils.tsx"

// hooks 
import { useFetchProducts } from "./hooks/products/useFetchProducts.tsx"
import { useFetchCart } from "./hooks/cart/useFetchCart.tsx"

// To prevent errors relating to checking user's access level
if (typeof localStorage.accessLevel === "undefined" || typeof localStorage.accessLevel === undefined) {
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
}

const AppContent: React.FC = () => {
    // Variables
    const navigate = useNavigate()
    const accessLevel = parseInt(localStorage.accessLevel)
    const isAdmin = accessLevel === ACCESS_LEVEL_ADMIN

    // Hook state variables
    const { products, loading, error } = useFetchProducts()
    const { cart } = useFetchCart(localStorage.id, isAdmin)

    // State variables
    const [categories, setCategories] = useState<string[]>([])
    const [counterMap, setCounterMap] = useState<Map<string, number>>(new Map())
    const [cartLength, setCartLength] = useState<number>(0)
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1)

    // Populating map and categories using fetched products
    useEffect(() => {
        if (!loading && products.length > 0) {
            const map: Map<string, number> = countCategoriesAndConditions(products)
            const categories: string[] = getCategories(products)

            setCategories([...new Set(categories)])
            setCounterMap(map)
        }
    }, [loading, products])

    // Update cart length whenever user id changes or the cart does
    useEffect(() => {
        if (cart && !isAdmin && cart.savedProducts != undefined) {
            setCartLength(cart.savedProducts.length)
        }
    }, [localStorage.id, cart]) // Update if either cart or user changes

    const handleRequestedQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = Number(e.target.value)
        setQuantityToAdd(quantity)
    }

    const addProductToCart = async (product: Product): Promise<void> => {
        // If user is not logged in, redirect them to login page
        if (localStorage.accessLevel < ACCESS_LEVEL_GUEST) {
            navigate("/login")
            return
        }
        // If they're an admin, let them know they are not authorised to use this feature
        else if (localStorage.accessLevel >= ACCESS_LEVEL_ADMIN) {
            alert("You are not authorised to use this feature!")
            return
        }

        // Object to send via axios
        const productToAdd = {
            productId: product._id,
            quantity: quantityToAdd
        }

        // Axios call for adding the product to user's specified cart
        try {
            const res = await axios.post(`${SERVER_HOST}/cart/${localStorage.id}`, productToAdd)

            if (res) {
                alert(res.data.message)

                setQuantityToAdd(1) // Reset the quantity number to add to basket back to its default value 1
                setCartLength(res.data.updatedLength) // Update cart length for header
            }
            else {
                alert("product was not added")
            }
        }
        catch (error: any) {
            console.error("Add product to cart error: ", error)
        }
    }

    // Mainly for components that also affect the cart's length via adding or deleting and are childrn components
    const updateCartLength = (newLength: number) => {
        setCartLength(newLength)
    }

    return (
        <Routes>
            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Home Pages */}
            <Route path="/" element={
                <Home
                    products={products}
                    categories={categories}
                    cartLength={cartLength}
                />
            }>
                <Route index element={
                    <HomeProducts
                        products={products}
                    />}
                />

                <Route path="cart" element={
                    <ShoppingCart
                        updateCartLength={updateCartLength}
                    />
                } />

                <Route path="products/:prefix?" element={
                    <Products
                        categories={categories}
                        counterMap={counterMap}
                        addProductToCart={addProductToCart}
                    />
                } />

                <Route path="purchase-history" element={
                    <PurchaseHistory />
                } />

                <Route path="favourites" element={
                    <Favourites />
                } />
            </Route>

            {/* Admin Pages */}
            <Route path="/admin" element={
                <Admin 
                    products={products}
                />
            } >
                <Route index element={
                    <Users />
                } />

                <Route path="products/:prefix?" element={
                    <Products
                        categories={categories}
                        counterMap={counterMap}
                        addProductToCart={addProductToCart}
                    />
                } />

                <Route path="product/:id" element={
                    <ViewProduct
                        products={products}
                        addProductToCart={addProductToCart}
                        handleRequestedQuantityChange={handleRequestedQuantityChange}
                        quantityToAdd={quantityToAdd}
                    />
                } />

                <Route path="add-product" element={
                    <AddProduct
                        categories={categories}
                    />
                } />

                <Route path="edit-product/:id" element={
                    <EditProduct
                        categories={categories}
                    />
                } />
            </Route>

            {/* Other */}
            <Route path="*" element={<NoPageFound />} />
        </Routes>
    )
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
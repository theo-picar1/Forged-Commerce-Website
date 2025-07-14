import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"

// axios
import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST } from "./config/global_constants.ts"

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

// All pages / views for Admin component
import AddProduct from "./components/pages/admin/AddProduct.tsx"
import EditProduct from "./components/pages/admin/EditProduct.tsx"
import Users from "./components/pages/admin/Users.tsx"

// Other components 
import ProtectedRoute from "./components/ProtectedRoute.tsx"
// Functions 
import { countCategoriesAndConditions, getCategories } from "./utils/product-utils.tsx"

// hooks 
import { useFetchProducts } from "./hooks/products/useFetchProducts.tsx"
import { useFetchCart } from "./hooks/cart/useFetchCart.tsx"
import { useFetchUsers } from "./hooks/users/useFetchUsers.tsx"
import { useAddProductToCart } from "./hooks/cart/useAddProductToCart.tsx"

// To prevent errors relating to checking user's access level
if (typeof localStorage.accessLevel === "undefined" || typeof localStorage.accessLevel === undefined) {
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
}

const AppContent: React.FC = () => {
    // Variables
    const navigate = useNavigate()
    const accessLevel = parseInt(localStorage.accessLevel)
    const isAdmin = accessLevel === ACCESS_LEVEL_ADMIN
    const isGuest = accessLevel === ACCESS_LEVEL_GUEST

    // Hook state variables
    const { products, loading, error } = useFetchProducts()
    const { cart, fetchCart } = useFetchCart(localStorage.id, isAdmin)
    const { users } = useFetchUsers(isAdmin)
    const { addProductToCart } = useAddProductToCart(isAdmin, isGuest)

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
    }, [])

    // Update cart length whenever user id changes or the cart does
    useEffect(() => {
        if (cart && !isAdmin && cart.savedProducts != undefined) {
            setCartLength(cart.savedProducts.length)
        }
    }, [localStorage.id]) // Update if either cart or user changes

    const handleRequestedQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = Number(e.target.value)
        setQuantityToAdd(quantity)
    }

    // Add a product to the user's cart, updating cart length
    const addProductAndUpdateCart = async (productId: string): Promise<void> => {
        if (!cart) return

        try {
            await addProductToCart(productId, quantityToAdd)

            await fetchCart()

            setQuantityToAdd(1) // Reset the quantity number to add to basket back to its default value 1
            setCartLength(cart.savedProducts.length) // Update cart length for header
        }
        catch {
            console.log("Failed to add cart to the product")
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
                    <ProtectedRoute isAdmin={isAdmin}>
                        <HomeProducts
                            products={products}
                        />
                    </ProtectedRoute>
                } />

                <Route path="cart" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <ShoppingCart
                            updateCartLength={updateCartLength}
                        />
                    </ProtectedRoute>
                } />

                <Route path="products/:prefix?" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <Products
                            categories={categories}
                            counterMap={counterMap}
                            addProductAndUpdateCart={addProductAndUpdateCart}
                        />
                    </ProtectedRoute>
                } />

                <Route path="product/:id" element={
                    <ViewProduct
                        products={products}
                        addProductAndUpdateCart={addProductAndUpdateCart}
                        handleRequestedQuantityChange={handleRequestedQuantityChange}
                        quantityToAdd={quantityToAdd}
                    />
                } />

                <Route path="purchase-history" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <PurchaseHistory />
                    </ProtectedRoute>
                } />

                <Route path="favourites" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <Favourites />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Admin Pages */}
            <Route path="/admin" element={
                <Admin
                    products={products}
                    users={users}
                />
            } >
                <Route index element={<Navigate to="users" replace />} />

                <Route path="users/:prefix?" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <Users />
                    </ProtectedRoute>
                } />

                <Route path="products/:prefix?" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <Products
                            categories={categories}
                            counterMap={counterMap}
                            addProductAndUpdateCart={addProductAndUpdateCart}
                        />
                    </ProtectedRoute>
                } />

                <Route path="product/:id" element={
                    <ViewProduct
                        products={products}
                        addProductAndUpdateCart={addProductAndUpdateCart}
                        handleRequestedQuantityChange={handleRequestedQuantityChange}
                        quantityToAdd={quantityToAdd}
                    />
                } />

                <Route path="purchase-history/:userId?" element={
                    <ProtectedRoute isAdmin={isAdmin}>
                        <PurchaseHistory />
                    </ProtectedRoute>
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
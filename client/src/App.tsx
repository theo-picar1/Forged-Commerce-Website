import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST } from "./config/global_constants.ts"
import axios from "axios"
import { SERVER_HOST } from "./config/global_constants.ts"

import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

// All individual pages
import Home from "./components/layouts/Home.tsx"
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

// Types
import { Product } from "./types/Product.ts"
import { History } from "./types/Purchases.ts"
import { Favourite } from "./types/Favourite.ts"

// Functions 
import { countCategoriesAndConditions, getCategories } from "./utils/product-utils.tsx"

// To prevent errors relating to checking user's access level
if (typeof localStorage.accessLevel === "undefined" || typeof localStorage.accessLevel === undefined) {
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
}

const AppContent: React.FC = () => {
    // For navigation purposes
    const navigate = useNavigate()

    // State variables
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([])
    const [productSearchValue, setProductSearchValue] = useState<string>("")
    const [counterMap, setCounterMap] = useState<Map<string, number>>(new Map())
    const [cartLength, setCartLength] = useState<number>(0)
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1)
    const [userFavourites, setFavourites] = useState<Favourite | null>(null)

    // Fetching products from the database
    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const res = await axios.get(`${SERVER_HOST}/products`)

                if (!res.data || res.data.length === 0) {
                    console.log(res.data.errorMessage)
                    return
                }

                // Calling functions to populate map and categories with data
                const map: Map<string, number> = countCategoriesAndConditions(res.data) 
                const categories: string[] = getCategories(res.data)

                setProducts(res.data)
                setCategories([...new Set(categories)])
                setCounterMap(map)

                return
            }
            catch (error: any) {
                if(error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }

                return
            }
        }

        fetchProducts()
    }, [])

    // Fetching the user's cart based on the id in the localStorage. Don't run if user is not signed in 
    useEffect(() => {
        if(localStorage.accessLevel < 1) return // End early if not signed in

        const userId = localStorage.getItem('id')
        if (!userId) console.log("User's id was not saved in localStorage!")

        const fetchCart = async (): Promise<void> => {
            try {
                const res = await axios.get(`${SERVER_HOST}/cart/${userId}`)

                if(!res || !res.data) {
                    console.log(res.data.errorMessage)
                }
                else {
                    setCartLength(res.data.products.length) // Update the cart length for th eheader component
                }

                return
            } 
            catch (error: any) {
                if(error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }

                return
            }
        }

        fetchCart()
    }, [])

    // Fetch user's purchase history based by their id
    useEffect(() => {
        if(localStorage.accessLevel < 1) return // End early if not signed in

        const userId = localStorage.getItem('id')
        if (!userId) return

        const fetchHistory = async (): Promise<void> => {
            try {
                const res = await axios.get(`${SERVER_HOST}/purchases/${userId}`)

                if (!res || !res.data) {
                    console.log('Unable to retrieve purchase history from the database!')
                } 
                else {
                    console.log('Successfully retrieved purchase history')
                }
            } 
            catch (error: any) {
                if(error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }

                return
            }
        }

        fetchHistory()
    }, [])

    // --------------- SEARCH FUNCTIONALITY ---------------
    const completeAutocomplete = (value: string): void => {
        setProductSearchValue(value)
        setAutocompleteSuggestions([])
    }

    const displayAutocompleteSuggestions = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let suggestions: string[] = []

        if (e.target.value !== "" && e.target.value.length > 0) {
            products.forEach(product => {
                if (product["product_name"].toLowerCase().startsWith(e.target.value.toLowerCase())) {
                    suggestions.push(product)
                }
            })
        }

        setAutocompleteSuggestions(suggestions)
        setProductSearchValue(e.target.value)
    }

    const filterProductsBySearchValue = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            let matched: Product[] = []

            products.forEach(product => {
                if (product["product_name"].startsWith(productSearchValue)) {
                    matched.push(product)
                }
            })

            navigate("/products")
        }
    }
    // ----------------------------------------------------

    // --------------- FILTER FUNCTIONALITY ---------------
    const filterProductsByHeaderCategory = (value: string): void => {
        let matched: Product[] = []

        if (value === "") {
            navigate('/products')
        } 
        else {
            products.forEach(product => {
                if (product["category"].includes(value)) {
                    matched.push(product)
                }
            })

            navigate('/products')
        }
    }

    const handleRequestedQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = Number(e.target.value)
        setQuantityToAdd(quantity)
    }
    // ----------------------------------------

    // ---------- CART FUNCTIONALITY ----------
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
    // ----------------------------------------------

    // ---------- FAVOURITING FUNCTIONALITY ----------
    useEffect(() => {
        const fetchFavourites = async (): Promise<void> => {
            try {
                const res = await axios.get<Favourite>(`${SERVER_HOST}/favourites/${localStorage.id}`)

                if (!res) {
                    console.log("Unable to fetch products")

                    return
                }

                setFavourites(res.data)
            }
            catch (error: any) {
                if (error.response.data.errorMessage) {
                    console.log(error.response.data.errorMessage)
                }
                else {
                    console.log(error)
                }
            }
        }

        fetchFavourites()
    }, [])

    // Function so that UI also updates immediately when product is removed from favourites
    const refreshFavourites = (productId: string, condition: string, productToAdd?: Product) => {
        if (condition === "remove") {
            setFavourites(prev => {
                // This is if userFavourites is null
                if (!prev) return prev

                // Remove the removed favourited product in the state
                const updated = {
                    ...prev,
                    favourites: prev.favourites.filter(favourite => favourite._id !== productId)
                }

                return updated
            })
        }
        else {
            setFavourites(prev => {
                // This is if userFavourites is null
                if (!prev) return prev
                if (!productToAdd) return prev

                const updatedFavourites = [...prev.favourites, productToAdd]

                return {
                    ...prev,
                    favourites: updatedFavourites
                }
            })
        }
    }

    const removeFavourite = async (productId: string) => {
        try {
            const res = await axios.delete(`${SERVER_HOST}/favourites/${localStorage.id}/${productId}`)

            if (!res.data || !res) {
                alert(res.data.message)
            }
            else {
                alert(res.data.message)

                refreshFavourites(productId, "remove")
            }

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.error(error.response.data.errorMessage)
            }
            else {
                console.error("Unexpected error: ", error)
            }
        }
    }
    // -----------------------------------------------

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
                    categories={categories}
                    suggestions={autocompleteSuggestions}
                    productSearchValue={productSearchValue}
                    displayAutocompleteSuggestions={displayAutocompleteSuggestions}
                    completeAutocomplete={completeAutocomplete}
                    filterProductsBySearchValue={filterProductsBySearchValue}
                    filterProductsByHeaderCategory={filterProductsByHeaderCategory}
                    cartLength={cartLength}
                />
            }>
                <Route index element={<HomeProducts products={products} />} />

                <Route path="cart" element={
                    <ShoppingCart
                        updateCartLength={updateCartLength}
                    />
                } />

                <Route path="products" element={
                    <Products
                        categories={categories}
                        counterMap={counterMap}
                        addProductToCart={addProductToCart}
                    />
                } />

                <Route path="product/:id" element={
                    <ViewProduct
                        userFavourites={userFavourites}
                        products={products}
                        addProductToCart={addProductToCart}
                        handleRequestedQuantityChange={handleRequestedQuantityChange}
                        quantityToAdd={quantityToAdd}
                        removeFavourite={removeFavourite}
                        refreshFavourites={refreshFavourites}
                    />
                } />

                <Route path="purchase-history" element={
                    <PurchaseHistory />
                } />

                <Route path="favourites" element={
                    <Favourites
                        userFavourites={userFavourites}
                        removeFavourite={removeFavourite}
                    />
                } />

                <Route path="edit-product/:id" element={
                    <EditProduct 
                        categories={categories}
                    />
                } />

                <Route path="users" element={
                    <Users />
                } />
            </Route>

            <Route path="*" element={<NoPageFound />} />
        </Routes>
    )
}

// Need to separate as useNavigate only works inside components rendered within a router, like BrowserRouter
// Before I had all logic in app, so useNavigate was defined outside BrowserRouter
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
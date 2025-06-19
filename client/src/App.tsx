import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { ACCESS_LEVEL_GUEST } from "./config/global_constants.ts"

import axios from "axios"
import { SERVER_HOST } from "./config/global_constants.ts"

import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

import Home from "./components/Home.tsx"
import NoPageFound from "./components/NoPageFound.tsx"
import Login from "./components/Login.tsx"
import Register from "./components/Register.tsx"
import ForgotPassword from "./components/ForgotPassword.tsx"

import HomeProducts from "./components/HomeProducts.tsx"
import ShoppingCart from "./components/ShoppingCart.tsx"
import Products from "./components/Products.tsx"
import ViewProduct from "./components/ViewProduct.tsx"
import PurchaseHistory from "./components/PurchaseHistory.tsx"

import { Product } from "./types/Product.ts"
import { Cart } from "./types/Cart.ts"
import { History } from "./types/Purchases.ts"

if (typeof localStorage.accessLevel === "undefined" || typeof localStorage.accessLevel === undefined) {
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.id = undefined
    localStorage.cartId = undefined
}

function openSlideInModal(modalToToggle: string): void {
    const modal = document.getElementById(modalToToggle)

    if (modal) {
        modal.classList.add("active")
    } else {
        alert(`Modal with ID '${modalToToggle}' was not found!`)
    }
}

function closeSlideInModal(modalToToggle: string): void {
    const modal = document.getElementById(modalToToggle)

    if (modal) {
        modal.classList.remove("active")
    } else {
        alert(`Modal with ID '${modalToToggle}' was not found!`)
    }
}

const switchProductView = (view: string): void => {
    let products = document.getElementById("products-section")
    if (products) {
        let cards = Array.from(document.getElementsByClassName("product")) as HTMLElement[]
        let imageContainers = Array.from(document.getElementsByClassName("product-image-container")) as any[]
        let addToCartBtn = Array.from(document.getElementsByClassName("add-to-shopping-cart-button")) as HTMLElement[]

        if (view === "list") {
            products.style.display = "flex"
            products.style.flexDirection = "column"
            products.style.gap = "10px"

            cards.forEach(card => {
                card.style.display = "flex"
                card.style.flexDirection = "row"
                card.style.gap = "15px"
                card.style.backgroundColor = "#ffffff"
                card.style.padding = "15px"
            })

            imageContainers.forEach(container => {
                container.style.borderRadius = "0"
                container.style.width = "150px"
                container.style.height = "inherit"
                container.style.aspectRatio = null

                let image = container.querySelector("img") as HTMLImageElement

                image.style.width = "100%"
                image.style.maxHeight = "100%"
            })

            addToCartBtn.forEach(button => {
                button.style.borderRadius = "50%"
                button.style.width = "40px"
                button.style.height = "40px"
                button.style.padding = "0"
            })
        } else if (view === "grid") {
            products.style.display = "grid"

            cards.forEach(card => {
                card.style.flexDirection = "column"
                card.style.gap = "5px"
                card.style.backgroundColor = "#f3f3f3"
                card.style.padding = "0"
            })

            imageContainers.forEach(container => {
                container.style.borderRadius = "10px"
                container.style.aspectRatio = "145 / 150"
                container.style.height = "auto"
                container.style.width = "100%"

                let image = container.querySelector("img") as HTMLImageElement

                image.style.width = "100%"
                image.style.maxHeight = "100%"
            })

            addToCartBtn.forEach(button => {
                button.style.borderRadius = "5px"
                button.style.width = "50px"
                button.style.height = "auto"
                button.style.padding = "5px 0"
            })
        }
    }
}

function capitiliseString(string: string): string {
    return string.substring(0, 1).toUpperCase() + string.substring(1)
}

const AppContent: React.FC = () => {
    const navigate = useNavigate()

    // === All your states and logic ===
    const [products, setProducts] = useState<any[]>([])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([])
    const [productSearchValue, setProductSearchValue] = useState<string>("")
    const [currentView, setCurrentView] = useState<string>("")
    const [counterMap, setCounterMap] = useState<Map<string, number>>(new Map())
    const [productToView, setProductToView] = useState<any>(null)
    const [cartLength, setCartLength] = useState<number>(0)
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1)

    useEffect(() => {
        const fetchProducts = async () => {
            const initCategories: string[] = []
            const initMap = new Map<string, number>([
                ['new', 0],
                ['used', 0],
            ])

            try {
                const res = await axios.get<Product[]>(`${SERVER_HOST}/products`)
                const data = res.data

                if (!data || data.length === 0) {
                    console.log('No products found')
                    return
                }

                data.forEach(product => {
                    if (product.category && product.category.length > 0) {
                        initCategories.push(...product.category)
                        product.category.forEach(category => {
                            initMap.set(category, (initMap.get(category) || 0) + 1)
                        })
                    }

                    if ('brand_new' in product) {
                        const condition = product.brand_new ? 'new' : 'used'
                        initMap.set(condition, (initMap.get(condition) || 0) + 1)
                    }
                })

                setProducts(data)
                setFilteredProducts(data)
                setCategories([...new Set(initCategories)])
                setCounterMap(initMap)
            } catch (err) {
                console.error('Error fetching products:', err)
            }
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem('id')
        if (!userId) return

        const fetchCart = async () => {
            try {
                const res = await axios.get<Cart>(`${SERVER_HOST}/cart/${userId}`)
                if (res.data) {
                    setCartLength(res.data.products.length)
                } else {
                    alert('Unable to retrieve cart from the database!')
                }
            } catch (err) {
                console.error('Error fetching cart:', err)
            }
        }

        fetchCart()
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem('id')
        if (!userId) return

        const fetchHistory = async () => {
            try {
                const res = await axios.get<History>(`${SERVER_HOST}/purchases/${userId}`)
                if (res.data) {
                    console.log('Successfully retrieved purchase history')
                } else {
                    alert('Unable to retrieve purchase history from the database!')
                }
            } catch (err) {
                console.error('Error fetching purchase history:', err)
            }
        }

        fetchHistory()
    }, [])

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

            setFilteredProducts(matched)
            switchProductView(currentView)
            navigate("/products")
        }
    }

    const filterProductsByHeaderCategory = (value: string): void => {
        let matched: Product[] = []

        if (value === "") {
            setFilteredProducts(products)
            navigate('/products')
            switchProductView(currentView)
        } else {
            products.forEach(product => {
                if (product["category"].includes(value)) {
                    matched.push(product)
                }
            })

            setFilteredProducts(matched)
            navigate('/products')
            switchProductView(currentView)
        }
    }

    const handleRequestedQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = Number(e.target.value)
        setQuantityToAdd(quantity)
    }

    const redirectToLogin = (): void => {
        if (localStorage.accessLevel > ACCESS_LEVEL_GUEST) {
            return
        }
        navigate("/login")
    }

    const addProductToCart = async (product: Product): Promise<void> => {
        redirectToLogin()

        const productToAdd = {
            productId: product._id,
            quantity: quantityToAdd
        }

        try {
            const res = await axios.post(`${SERVER_HOST}/cart/${localStorage.id}`, productToAdd)

            if (res) {
                alert("Product added!")
                setQuantityToAdd(1)
                setCartLength(res.data.updatedLength)
            } else {
                alert("product was not added")
            }
        } catch (error: any) {
            console.error("Add product to cart error: ", error)
        }
    }

    const updateCartLength = (newLength: number) => {
        setCartLength(newLength)
    }

    const switchProductViewImage = (view: string): void => {
        setCurrentView(view)
        switchProductView(view)
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/" element={
                <Home
                    categories={categories}
                    capitiliseString={capitiliseString}
                    suggestions={autocompleteSuggestions}
                    productSearchValue={productSearchValue}
                    displayAutocompleteSuggestions={displayAutocompleteSuggestions}
                    completeAutocomplete={completeAutocomplete}
                    filterProductsBySearchValue={filterProductsBySearchValue}
                    filterProductsByHeaderCategory={filterProductsByHeaderCategory}
                    cartLength={cartLength}
                    closeSlideInModal={closeSlideInModal}
                    openSlideInModal={openSlideInModal}
                />
            }>
                <Route index element={<HomeProducts products={products} />} />
                <Route path="cart" element={
                    <ShoppingCart
                        cartLength={cartLength}
                        categories={categories}
                        capitiliseString={capitiliseString}
                        updateCartLength={updateCartLength}
                    />
                } />
                <Route path="products" element={
                    <Products
                        originalProducts={products}
                        filteredProducts={filteredProducts}
                        switchProductViewImage={switchProductViewImage}
                        currentView={currentView}
                        openSlideInModal={openSlideInModal}
                        closeSlideInModal={closeSlideInModal}
                        categories={categories}
                        capitiliseString={capitiliseString}
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
                <Route path="purchase-history" element={<PurchaseHistory />} />
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
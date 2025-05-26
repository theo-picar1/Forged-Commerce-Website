import React, { Component } from "react"
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants.ts"
import { Product } from "../types/Product.ts"

import Header from './Header.tsx'
import Footer from './Footer.tsx'
import HomeProducts from "./HomeProducts.tsx"
import Menu from "./Menu.tsx"
import ShoppingCart from "./ShoppingCart.tsx"
import Products from "./Products.tsx"
import ViewProduct from "./ViewProduct.tsx"

// Define the type for props
type HomeProps = RouteComponentProps // Add extra props if needed

// Define the type for state
type HomeState = {
    products: any[]
    filteredProducts: any[]
    categories: string[]
    bestSellerCount: number
    categoryToFilterBy: string
    autocompleteSuggestions: any[]
    productSearchValue: string
    currentView: string
    counterMap: Map<string, number>
    productToView: any
}

class Home extends Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props)

        this.state = {
            products: [],
            filteredProducts: [],
            categories: [],
            bestSellerCount: 0,
            categoryToFilterBy: "",
            autocompleteSuggestions: [],
            productSearchValue: "",
            currentView: "grid",
            counterMap: new Map(), // To show the amount of a particular category (plus the brand new products) for the user. Also takes into account any new category added
            productToView: null // For ViewProduct.js. Will change this to an actual url {id} down the line
        }
    }

    componentDidMount(): void {
        let initCategories: string[] = [] // Array that just acts as a placeholder until we get all the unique cateogries from it
        let bestSellerCounter = 0
        let initMap = new Map()

        // For the boolean field 'brand_new'
        initMap.set("new", 0)
        initMap.set("used", 0)

        axios.get<Product[]>(`${SERVER_HOST}/products`).then(res => {
            if (!res.data || res.data.length === 0) {
                console.log("No products found")
                return
            }
            res.data.forEach(product => {
                if ("category" in product && product["category"].length > 0) {
                    initCategories.push(...product["category"]) // Push every single category to the placeholder array

                    // Logic that will have a counter for each category found in the JSON data
                    product["category"].forEach(category => {
                        if (initMap.has(category)) {
                            initMap.set(category, initMap.get(category) + 1)
                        }
                        else {
                            initMap.set(category, 1)
                        }
                    })

                    if ("brand_new" in product) {
                        if (product["brand_new"]) {
                            initMap.set("new", initMap.get("new") + 1)
                        } else {
                            initMap.set("used", initMap.get("used") + 1)
                        }
                    }
                }

                if ("sold" in product && product["sold"] > 250) {
                    bestSellerCounter++
                }
            })

            this.setState({
                products: res.data,
                filteredProducts: res.data,
                categories: [...new Set(initCategories)],
                bestSellerCount: bestSellerCounter, // Don't remember why I even have this
                counterMap: initMap
            })
        })
    }
    // ----------------------------------------------------

    // --------------- Modal Functions ---------------
    openSlideInModal(modalToToggle: string): void {
        const modal = document.getElementById(modalToToggle)

        if (modal) {
            modal.classList.add("active") // Active class has css that will bring the modal into view with a slide
        }
        else {
            alert(`Modal with ID '${modalToToggle}' was not found!`)
        }
    }

    closeSlideInModal(modalToToggle: string): void {
        const modal = document.getElementById(modalToToggle)

        if (modal) {
            modal.classList.remove("active") // Active class has css that will bring the modal into view with a slide
        }
        else {
            alert(`Modal with ID '${modalToToggle}' was not found!`)
        }
    }

    // This fills out the searchbar with the value of the suggestion the user clicked on
    completeAutocomplete = (value: string): void => {
        this.setState({
            productSearchValue: value,
            autocompleteSuggestions: [] // Initialise back to empty array so that autocomplete modal hides after clicking on one of the suggestions
        })
    }
    // -----------------------------------------------

    // --------------- Filter Functions ---------------
    displayAutocompleteSuggestions = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let suggestions: string[] = []

        if (e.target.value !== "" && e.target.value.length > 0) {
            this.state.products.forEach(product => {
                // Skip the product if the first few chars of product does not start with current user input
                if (product["product_name"].toLowerCase().startsWith(e.target.value.toLowerCase())) {
                    suggestions.push(product)
                }
            })
        }

        this.setState({
            autocompleteSuggestions: suggestions,
            productSearchValue: e.target.value
        })
    }

    filterProductsBySearchValue = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            let matched: Product[] = []

            this.state.products.map(product => {
                if (product["product_name"].startsWith(this.state.productSearchValue)) {
                    matched.push(product)
                }
            })

            // After the user presses enter, it will redirect them to the page where the filtered products will be shown
            this.setState({
                filteredProducts: matched
            }, () => {
                this.props.history.push('/products')
                this.switchProductView(this.state.currentView)
            })
        }
    }

    // This category filters only allows the user to filter by one category. Multiple categories will be a separate thing with a specialised modal
    filterProductsByHeaderCategory = (value: string): void => {
        let matched: Product[] = []

        // Just set the filteredProducts to every single product if the user clicks the All option (which has a value of "")
        if (value === "") {
            this.setState({
                filteredProducts: this.state.products
            }, () => {
                this.props.history.push("/products")
                this.switchProductView(this.state.currentView) // This is because scss is not applied to any products that were not shown initially during filtering process
            })
        }
        else {
            this.state.products.map(product => {
                if (product["category"].includes(value)) {
                    matched.push(product)
                }
            })

            this.setState({
                filteredProducts: matched
            }, () => {
                this.props.history.push("/products")
                this.switchProductView(this.state.currentView)
            })
        }
    }
    // ------------------------------------------------

    // --------------- Helper Functions --------------- 
    capitiliseString(string: string): string {
        return string.substring(0, 1).toUpperCase() + string.substring(1)
    }

    // logItems() {
    //     this.state.products.forEach(product => {
    //         console.log(product)
    //     })

    //     this.state.categories.forEach(category => {
    //         console.log(category)
    //     })
    // }
    // -------------------------------------------------

    // --------------- Functions mainly for Products.js ---------------
    switchProductViewImage = (view: string): void => {
        this.setState({
            currentView: view
        }, () => this.switchProductView(view))
    }

    switchProductView = (view: string): void => {
        let products = document.getElementById("products-section")

        // To stop app from breaking because the html stuff in Products has not loaded yet. This is cuased when navigating to Products when in a different component
        // It works normal when calling switchProductViewImage from inside the Products.js component
        if (products) {

            let cards = Array.from(document.getElementsByClassName("product")) as HTMLElement[]
            let imageContainers = Array.from(document.getElementsByClassName("product-image-container")) as any[]
            let addToCartBtn = Array.from(document.getElementsByClassName("add-to-shopping-cart-button")) as HTMLElement[]

            if (view === "list") {
                products.style.display = "flex"
                products.style.flexDirection = "column"
                products.style.gap = "10px"

                Array.from(cards).forEach(card => {
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

                Array.from(addToCartBtn).forEach(button => {
                    button.style.borderRadius = "50%"
                    button.style.width = "40px"
                    button.style.height = "40px"
                    button.style.padding = "0"
                })
            }
            else if (view === "grid") {
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
                    container.style.width = "100%";

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
    // ----------------------------------------------------------------

    // --------------- Functions mainly for ViewProduct.js ---------------
    setProductToView = (product: Product) : void => {
        axios.get(`${SERVER_HOST}/products/${product._id}`).then(res => {
            if (res.data) {
                if (res.data.errorMessage) {
                    console.log(res.data.errorMessage)
                }
                else {
                    this.setState({
                        productToView: product
                    }, () => this.props.history.push("/view-product"))
                }
            }
            else {
                console.log("Product with provided ID not found!")
            }
        })
    }
    // -------------------------------------------------------------------

    render() {
        return (
            <React.Fragment>
                <Menu
                    categories={this.state.categories}
                    capitiliseString={this.capitiliseString}
                    closeSlideInModal={this.closeSlideInModal}
                />

                <Header
                    categories={this.state.categories}
                    capitiliseString={this.capitiliseString}
                    openSlideInModal={this.openSlideInModal}
                    displayAutocompleteSuggestions={this.displayAutocompleteSuggestions}
                    suggestions={this.state.autocompleteSuggestions}
                    productSearchValue={this.state.productSearchValue}
                    completeAutocomplete={this.completeAutocomplete}
                    filterProductsBySearchValue={this.filterProductsBySearchValue}
                    filterProductsByHeaderCategory={this.filterProductsByHeaderCategory}
                />

                {/* This is so that I can switch between different components while still keeping the header and footer components */}
                <Switch>
                    <Route exact path="/">
                        <HomeProducts
                            products={this.state.products}
                            categories={this.state.categories}
                            capitiliseString={this.capitiliseString}
                            currentView={this.state.currentView}
                            setProductToView={this.setProductToView}
                        />
                    </Route>

                    <Route exact path="/cart">
                        <ShoppingCart
                            products={this.state.products}
                            categories={this.state.categories}
                            capitiliseString={this.capitiliseString}
                        />
                    </Route>

                    <Route exact path="/products">
                        <Products
                            originalProducts={this.state.products}
                            filteredProducts={this.state.filteredProducts}
                            switchProductViewImage={this.switchProductViewImage}
                            currentView={this.state.currentView}
                            openSlideInModal={this.openSlideInModal}
                            closeSlideInModal={this.closeSlideInModal}
                            categories={this.state.categories}
                            capitiliseString={this.capitiliseString}
                            counterMap={this.state.counterMap}
                            setProductToView={this.setProductToView}
                        />
                    </Route>

                    <Route exact path="/view-product">
                        <ViewProduct
                            productToView={this.state.productToView}
                            products={this.state.products}
                            setProductToView={this.setProductToView}
                        />
                    </Route>
                </Switch>

                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Home) // For redirecting purposes. e.g. when user presses 'Enter' in searchbar, it redirects them to the actual products page
import React, { Component } from "react"
import { Switch, Route, withRouter } from "react-router-dom"

import Header from './Header'
import Footer from "./Footer"
import HomeProducts from "./HomeProducts"
import Menu from "./Menu"
import ShoppingCart from "./ShoppingCart"
import Products from "./Products"

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            filteredProducts: [],
            categories: [],
            bestSellerCount: 0,
            categoryToFilterBy: "",
            autocompleteSuggestions: [],
            productSearchValue: "",
            currentView: "grid"
        }
    }

    componentDidMount() {
        let url = "/json/products.json"
        let initCategories = [] // Array that just acts as a placeholder until we get all the unique cateogries from it
        let bestSellerCounter = 0

        fetch(url).then(response => response.json()).then(data => {
            data.forEach(product => {
                if (product["category"] && product["category"].length > 0) {
                    initCategories.push(...product["category"]) // Push every single category to the placeholder array
                }

                if (product["sold"] > 250) {
                    bestSellerCounter++
                }
            })

            this.setState({
                products: data,
                filteredProducts: data,
                categories: [...new Set(initCategories)],
                bestSellerCount: bestSellerCounter, // Don't remember why I even have this
            })
        })
    }
    // ----------------------------------------------------

    // --------------- Modal Functions ---------------
    openSlideInModal(modalToToggle) {
        let modal = document.getElementById(modalToToggle)

        modal.classList.add("active") // Active class has css that will bring the modal into view with a slide
    }

    closeSlideInModal(modalToToggle) {
        let modal = document.getElementById(modalToToggle)

        modal.classList.remove("active")
    }

    // This fills out the searchbar with the value of the suggestion the user clicked on
    completeAutocomplete = (value) => {
        this.setState({
            productSearchValue: value,
            autocompleteSuggestions: [] // Initialise back to empty array so that autocomplete modal hides after clicking on one of the suggestions
        })
    }
    // -----------------------------------------------

    // --------------- Filter Functions ---------------
    displayAutocompleteSuggestions = (e) => {
        let suggestions = []

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

    filterProductsBySearchValue = e => {
        if (e.key === 'Enter') {
            let matched = []

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
    filterProductsByHeaderCategory = e => {
        let matched = []

        // Just set the filteredProducts to every single product if the user clicks the All option (which has a value of "")
        if (e.target.value === "") {
            this.setState({
                filteredProducts: this.state.products
            }, () => {
                this.props.history.push("/products")
                this.switchProductView(this.state.currentView) // This is because scss is not applied to any products that were not shown initially during filtering process
            })
        }
        else {
            this.state.products.map(product => {
                if (product["category"].includes(e.target.value)) {
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
    capitiliseString(string) {
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
    switchProductViewImage = (view) => {
        this.setState({
            currentView: view
        }, () => this.switchProductView(view))
    }

    switchProductView = (view) => {
        let products = document.getElementById("products-section")

        // To stop app from breaking because the html stuff in Products has not loaded yet. This is cuased when navigating to Products when in a different component
        // It works normal when calling switchProductViewImage from inside the Products.js component
        if(!products) {
            return
        }

        let cards = document.getElementsByClassName("product")
        let imageContainers = document.getElementsByClassName("product-image-container")
        let addToCartBtn = document.getElementsByClassName("add-to-shopping-cart-button")

        if (view === "list") {
            products.style.display = "flex"
            products.style.flexDirection = "column"
            products.style.gap = "10px"

            Array.from(cards).map(card => {
                card.style.display = "flex"
                card.style.flexDirection = "row"
                card.style.gap = "15px"
                card.style.backgroundColor = "#ffffff"
                card.style.padding = "15px"
            })

            Array.from(imageContainers).map(container => {
                container.style.borderRadius = "0"
                container.style.width = "150px"
                container.style.height = "inherit"
                container.style.aspectRatio = null

                let image = container.querySelector("img")

                image.style.width = "30px"
            })

            Array.from(addToCartBtn).map(button => {
                button.style.borderRadius = "50%"
                button.style.width = "40px"
                button.style.height = "40px"
                button.style.padding = "0"
            })
        }
        else if(view === "grid") {
            products.style.display = "grid"

            Array.from(cards).map(card => {
                card.style.flexDirection = "column"
                card.style.gap = "5px"
                card.style.backgroundColor = "#f3f3f3"
                card.style.padding = "0"
            })

            Array.from(imageContainers).map(container => {
                container.style.borderRadius = "10px"
                container.style.aspectRatio = "145 / 150"
                container.style.height = "auto"
                container.style.width = "100%";

                let image = container.querySelector("img")

                image.style.width = "75px"
            })

            Array.from(addToCartBtn).map(button => {
                button.style.borderRadius = "5px"
                button.style.width = "50px"
                button.style.height = "auto"
                button.style.padding = "5px 0"
            })
        }
    }
    // ----------------------------------------------------------------

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
                    showAutocompleteModal={this.showAutocompleteModal}
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
                            filteredProducts={this.state.filteredProducts}
                            switchProductViewImage={this.switchProductViewImage}
                            currentView={this.state.currentView}
                        />
                    </Route>
                </Switch>

                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Home) // For redirecting purposes. e.g. when user presses 'Enter' in searchbar, it redirects them to the actual products page
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
            productSearchValue: ""
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
                bestSellerCount: bestSellerCounter // Don't remember why I even have this
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
            this.setState({ filteredProducts: matched }, () => {
                this.props.history.push('/products')
            })
        }
    }

    // This category filters only allows the user to filter by one category. Multiple categories will be a separate thing with a specialised modal
    filterProductsByHeaderCategory = e => {
        let matched = []

        // Just set the filteredProducts to every single product if the user clicks the All option (which has a value of "")
        if (e.target.value === "") {
            this.setState({ filteredProducts: this.state.products }, () => {
                this.props.history.push("/products")
            })
        }
        else {
            this.state.products.map(product => {
                if (product["category"].includes(e.target.value)) {
                    matched.push(product)
                }
            })

            this.setState({ filteredProducts: matched }, () => {
                this.props.history.push("/products")
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
                        />
                    </Route>
                </Switch>

                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter(Home) // For redirecting purposes. e.g. when user presses 'Enter' in searchbar, it redirects them to the actual products page
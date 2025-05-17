import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import Header from './Header'
import Footer from "./Footer"
import HomeProducts from "./HomeProducts"
import Menu from "./Menu"
import ShoppingCart from "./ShoppingCart"
import Products from "./Products"

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: [],
            categories: [],
            bestSellerCount: 0
        }
    }

    componentDidMount() {
        let url = "/json/products.json"
        let initCategories = []
        let bestSellerCounter = 0

        fetch(url).then(response => response.json()).then(data => {
            data.forEach(product => {
                if (product["category"] && product["category"].length > 0) {
                    initCategories.push(...product["category"])
                }

                if (product["sold"] > 250) {
                    bestSellerCounter++
                }
            })

            this.setState({
                products: data,
                categories: [...new Set(initCategories)],
                bestSellerCount: bestSellerCounter
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

    showAutocompleteModal = (e, modalToShow) => {
        let modal = document.getElementById(modalToShow)

        if(e.target.value !== "" && e.target.value.length > 0) {
            modal.style.display = "block"
        }
        else {
            modal.style.display = "none"
        }
    }

    displayAutocompleteSuggestions = (e) => {
        let suggestionsString = ""
        let modal = document.getElementById("product-autocomplete-modal")

        if (e.target.value !== "" && e.target.value.length > 0) {
            this.state.products.forEach(product => {
                let match = true

                // For loop of the user's input so that only products that matches the first 'x' characters of the input are shown
                for (let i = 0; i < e.target.value.length; i++) {
                    // Immediately skip the product if the current char does not match
                    if (product["product_name"].toLowerCase().charAt(i) !== e.target.value.toLowerCase().charAt(i)) {
                        match = false

                        break
                    }
                }

                if (match) {
                    suggestionsString += `
                        <div>
                            <img src="/images/search-icon.png" />

                            <p>${product["product_name"]}</p>
                        </div>
                    `
                }
            })
        }

        modal.innerHTML = suggestionsString
    }
    // -----------------------------------------------

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
                />

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
                        <Products />
                    </Route>
                </Switch>

                <Footer />
            </React.Fragment>
        )
    }
}
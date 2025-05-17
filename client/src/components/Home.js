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
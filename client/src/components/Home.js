import React, {Component} from "react"

import Header from './Header'
import Footer from "./Footer"
import HomeProducts from "./HomeProducts"

export default class Home extends Component 
{
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
                if(product["category"] && product["category"].length > 0) {
                    initCategories.push(...product["category"])
                }

                if(product["sold"] > 250) {
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

    // --------------- Helper Functions --------------- //
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
   
    render() 
    {   
        return (  
            <React.Fragment>
                <Header 
                    categories={ this.state.categories }
                    capitiliseString={ this.capitiliseString }
                />
                
                <HomeProducts 
                    products={ this.state.products }
                    categories={ this.state.categories }
                    capitiliseString={ this.capitiliseString }
                />

                <Footer />
            </React.Fragment>
        )
    }
}
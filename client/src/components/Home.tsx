import React from "react"
import { Outlet } from "react-router-dom"

// components
import Menu from "./Menu.tsx"
import Header from "./Header.tsx"
import Footer from "./Footer.tsx"
import AddProduct from "./AddProduct.tsx"

interface HomeProps {
    categories: string[]
    suggestions: any[]
    productSearchValue: string
    displayAutocompleteSuggestions: (e: React.ChangeEvent<HTMLInputElement>) => void
    completeAutocomplete: (value: string) => void
    filterProductsBySearchValue: (e: React.KeyboardEvent<HTMLInputElement>) => void
    filterProductsByHeaderCategory: (value: string) => void
    cartLength: number
}

const Home: React.FC<HomeProps> = ({
    categories,
    suggestions,
    productSearchValue,
    displayAutocompleteSuggestions,
    completeAutocomplete,
    filterProductsBySearchValue,
    filterProductsByHeaderCategory,
    cartLength
}) => {
    // --------------------------------------------------------
    return (
        <React.Fragment>
            <Menu
                categories={categories}
            />

            <AddProduct 
                categories={categories}
            />

            <Header
                categories={categories}
                displayAutocompleteSuggestions={displayAutocompleteSuggestions}
                suggestions={suggestions}
                productSearchValue={productSearchValue}
                completeAutocomplete={completeAutocomplete}
                filterProductsBySearchValue={filterProductsBySearchValue}
                filterProductsByHeaderCategory={filterProductsByHeaderCategory}
                cartLength={cartLength}
            />

            <Outlet />

            <Footer />
        </React.Fragment>
    )
}

export default Home 
import React from "react"
import { Outlet } from "react-router-dom"

import Menu from "./Menu.tsx"
import Header from "./Header.tsx"
import Footer from "./Footer.tsx"

interface HomeProps {
    categories: string[]
    capitiliseString: (str: string) => string
    suggestions: any[]
    productSearchValue: string
    displayAutocompleteSuggestions: (e: React.ChangeEvent<HTMLInputElement>) => void
    completeAutocomplete: (value: string) => void
    filterProductsBySearchValue: (e: React.KeyboardEvent<HTMLInputElement>) => void
    filterProductsByHeaderCategory: (value: string) => void
    cartLength: number
    closeSlideInModal: (modalToToggle: string) => void
    openSlideInModal: (modalToToggle: string) => void
}

const Home: React.FC<HomeProps> = ({
    categories,
    capitiliseString,
    suggestions,
    productSearchValue,
    displayAutocompleteSuggestions,
    completeAutocomplete,
    filterProductsBySearchValue,
    filterProductsByHeaderCategory,
    cartLength,
    closeSlideInModal,
    openSlideInModal,
}) => {
    // --------------------------------------------------------
    return (
        <React.Fragment>
            <Menu
                categories={categories}
                capitiliseString={capitiliseString}
                closeSlideInModal={closeSlideInModal}
            />

            <Header
                categories={categories}
                capitiliseString={capitiliseString}
                openSlideInModal={openSlideInModal}
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
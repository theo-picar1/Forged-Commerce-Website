import React from "react"
import { Outlet } from "react-router-dom"

// components
import Menu from "../modals/Menu.tsx"
import Header from "./Header.tsx"
import Footer from "./Footer.tsx"

// types
import { Product } from "../../types/Product.ts"

interface HomeProps {
    products: Product[]
    categories: string[]
    cartLength: number
}

const Home: React.FC<HomeProps> = ({
    products,
    categories,
    cartLength
}) => {
    // --------------------------------------------------------
    return (
        <React.Fragment>
            <Menu
                categories={categories}
            />

            <Header
                products={products}
                cartLength={cartLength}
            />

            {/* All nested Home routes here. Defined in App.tsx */}
            <Outlet />

            <Footer />
        </React.Fragment>
    )
}

export default Home 
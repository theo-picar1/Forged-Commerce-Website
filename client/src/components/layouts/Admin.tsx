// Base component for all admin only pages
import React from "react"
import { Outlet } from "react-router-dom"

// components
import Menu from "../modals/Menu"
import SideMenu from "../pages/admin/SideMenu"
import Header from "./Header"

// types
import { Product } from "../../types/Product"

interface AdminProps {
    products: Product[]
}

const Admin: React.FC<AdminProps> = ({
    products
}) => {
    return (
        <div className="admin-page">
            <Menu />

            <Header 
                products={products}
            />

            <main>
                <SideMenu />

                <Outlet />
            </main>
        </div>
    )
}

export default Admin
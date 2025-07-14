// Base component for all admin only pages
import React from "react"
import { Outlet } from "react-router-dom"

// components
import Menu from "../modals/Menu"
import SideMenu from "../pages/admin/SideMenu"
import Header from "./Header"

// types
import { Product } from "../../types/Product"
import { User } from "../../types/User"

interface AdminProps {
    products: Product[]
    users: User[]
}

const Admin: React.FC<AdminProps> = ({
    products,
    users
}) => {
    return (
        <div className="admin-page">
            <Menu />

            <Header 
                products={products}
                users={users}
            />

            <main>
                <SideMenu />

                <Outlet />
            </main>
        </div>
    )
}

export default Admin
// Base component for all admin only pages
import React from "react"
import { Outlet } from "react-router-dom"

// components
import Menu from "../modals/Menu"
import AdminHeader from "./AdminHeader"
import SideMenu from "../pages/admin/SideMenu"

const Admin: React.FC = () => {
    return (
        <div className="admin-page">
            <Menu />

            <AdminHeader />

            <main>
                <SideMenu />

                <Outlet />
            </main>
        </div>
    )
}

export default Admin
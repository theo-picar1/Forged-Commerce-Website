// Wrapper component for any component that involves redirection
import React from "react"
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ isAdmin, children }: { isAdmin: boolean, children: React.ReactNode }) => {
    const location = useLocation()
    const path = location.pathname

    const isAdminRoute = path.startsWith('/admin')

    // If we're an admin and in a user's route, redirect. If we're a user and in an admin's route, redirect
    if (isAdminRoute && !isAdmin) {
        return <Navigate to="/" replace />
    }
    else if (!isAdminRoute && isAdmin) {
        return <Navigate to="/admin" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { openSlideInModal } from "../../utils/dom-utils"

const AdminHeader: React.FC = () => {
    return (
        <React.Fragment>
            <header className="admin-header">
                <div className="left">
                    <img src="/images/menu-icon.png" alt="Menu button" className="menu-icon" onClick={() => openSlideInModal("menu-modal")} />

                    <Link to="" className="website-title">
                        <img src="/images/app-logo.png" alt="" />
                        <p>FORGED</p>
                    </Link>
                </div>
            </header>
        </React.Fragment>
    )
}

export default AdminHeader
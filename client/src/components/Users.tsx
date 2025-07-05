import React, { useState, useEffect } from "react"

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import { User } from "../types/User"

const Users: React.FC = () => {
    // State variables
    const [users, setUsers] = useState<User[] | []>([])

    // Get all users
    const fetchUsers = async (): Promise<void> => {
        try {
            const res = await axios.get(`${SERVER_HOST}/users`)

            if (!res || !res.data) {
                alert(res.data.errorMessage)
            }
            else {
                // Set users and let user know
                setUsers(res.data.users)
                console.log(res.data.message)
            }

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                console.error(error.response.data.errorMessage)
            }
            else {
                console.error(error)
            }

            return
        }
    }

    // When component mounts, call function to get all users from the database to display it
    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="user-manager-page">
            <h3>Users Manager</h3>

            <div className="users">
                {users
                    // Ignore admin accounts
                    .filter(user => user.accessLevel < 2).map(user => (
                        <div className="user" key={user._id}>
                            {user.profile_picture && user.profile_picture !== "" ? (
                                <img src={user.profile_picture} className="user-profile"/>
                            ) : (
                                <img src="/images/high-res-user-plcaholder.png" className="placeholder-image"/>
                            )}

                            <div className="user-details">
                                <h4>{user.firstName} {user.lastName}</h4>

                                <div className="details">
                                    <div className="detail-section">
                                        <b>Email</b>

                                        <p>{user.email}</p>
                                    </div>

                                    <div className="detail-section">
                                        <b>Telephone</b>

                                        <p>{user.telephoneNo}</p>
                                    </div>

                                    <div className="detail-section">
                                        <b>Eircode</b>

                                        <p>{user.houseAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <div className="button">
                                    <img src="/images/visibility-icon.png" />

                                    <p>View</p>
                                </div>

                                <div className="button">
                                    <img src="/images/bin-icon.png" />

                                    <p>Delete</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Users
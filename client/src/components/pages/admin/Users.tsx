import React, { useState, useEffect } from "react"

// axios
import axios from "axios"
import { SERVER_HOST } from "../../../config/global_constants"

// types
import { User } from "../../../types/User"

// components
import AddUser from "./AddUser"

// functions
import { openSlideInModal } from "../../../utils/dom-utils"

// hooks
import { useFetchUsers } from "../../../hooks/users/useFetchUsers"
import { useAddUser } from "../../../hooks/users/useAddUser"

const Users: React.FC = () => {
    const { users, loading, error, fetchUsers } = useFetchUsers()
    const { loading: loadingAdd, addUser } = useAddUser()

    // To update users when a new user is added in AddUser component
    const addAndUpdateUsers = async (formData: FormData): Promise<void> => {
        try {
            await addUser(formData)

            await fetchUsers()
        }
        catch {
            console.log("Failed to fetch users")
        }
    }

    return (
        <React.Fragment>
            <AddUser
                addAndUpdateUsers={addAndUpdateUsers}
            />

            <div className="user-manager-page">
                <h3>Users Manager</h3>

                <div className="user-manager-tools">
                    <div className="button">
                        <img src="/images/add-icon.png" onClick={() => openSlideInModal("add-user-modal")} />

                        <p>Add user</p>
                    </div>
                </div>

                <div className="users">
                    {users
                        // Ignore admin accounts
                        .filter(user => user.accessLevel < 2).map(user => (
                            <div className="user" key={user._id}>
                                {user.profile_picture && user.profile_picture !== "" ? (
                                    <img src={`${SERVER_HOST}/uploads/users/${user.profile_picture}`} className="user-profile" />
                                ) : (
                                    <img src="/images/high-res-user-plcaholder.png" className="placeholder-image" />
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
        </React.Fragment>
    )
}

export default Users
import React from "react"
import { useParams, useNavigate } from "react-router-dom"

// axios
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../../../config/global_constants"

// components
import AddUser from "./AddUser"

// functions
import { openSlideInModal } from "../../../utils/dom-utils"

// hooks
import { useFetchUsersWithPrefix } from "../../../hooks/users/useFetchUsersWithPrefix"
import { useAddUser } from "../../../hooks/users/useAddUser"
import { useDeleteUser } from "../../../hooks/users/useDeleteUser"

const Users: React.FC = () => {
    // Variables
    const isAdmin = parseInt(localStorage.accessLevel) === ACCESS_LEVEL_ADMIN

    const { prefix } = useParams<{ prefix?: string }>()
    const searchPrefix = prefix?.trim() || "" 

    const navigate = useNavigate()


    const { users, fetchUsersWithPrefix } = useFetchUsersWithPrefix(searchPrefix)
    const { loading: loadingAdd, addUser } = useAddUser()
    const { deleteUser } = useDeleteUser(isAdmin)

    // To update users when a new user is added in AddUser component
    const addAndUpdateUsers = async (formData: FormData): Promise<void> => {
        try {
            await addUser(formData)

            await fetchUsersWithPrefix()
        }
        catch {
            console.log("Failed to fetch users")
        }
    }

    // Delete a user by id and refetch all users
    const deleteAndUpdateUsers = async (userId: string): Promise<void> => {
        try {
            await deleteUser(userId)

            await fetchUsersWithPrefix()
        }
        catch {
            console.log("Failed to delete product")
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
                                    <div className="button" onClick={() => navigate(`/admin/purchase-history/${user._id}`)}>
                                        <img src="/images/visibility-icon.png" />

                                        <p>View</p>
                                    </div>

                                    <div className="button" onClick={() => deleteAndUpdateUsers(user._id)}>
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
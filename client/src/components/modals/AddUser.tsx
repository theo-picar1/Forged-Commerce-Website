import React, { useReducer, useRef, useState } from "react"

// axios
import { SERVER_HOST } from "../../config/global_constants"
import axios from "axios"

// types
import { User } from "../../types/User"

// functions
import { capitiliseString } from "../../utils/string-utils"
import { closeSlideInModal } from "../../utils/dom-utils"

// Props
interface AddUserProps {
    updateUsers: (user: User) => void
}

// *** IMPORTANT: Component uses useReducer. Explanation comments are in here ***
// Defining states for useReducer rather than doing multiple useState
type FormState = {
    firstName: string
    lastName: string
    email: string
    password: string
    houseAddress: string
    telephoneNo: string
    accessLevel: number
}

// Defines updates for this form. UPDATE_FIELD is the same as 'setSomething', RESET_FORM just resets fields to intial values
type FormAction =
    | { type: 'UPDATE_FIELD'; field: keyof FormState; value: string | number }
    | { type: 'RESET_FORM' }

const AddUser: React.FC<AddUserProps> = ({
    updateUsers
}) => {
    // Separate state variables
    const [profile_picture, setPicture] = useState<File | null>(null)

    // File input ref for adding image button
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // For opening file input 
    const openFile = (): void => {
        fileInputRef.current?.click()
    }

    // Initial state values
    const initialFormState: FormState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        houseAddress: '',
        telephoneNo: '',
        accessLevel: 0
    }

    // For handling all state variables defined in FormState. More concise than me just doing useState
    const formReducer = (state: FormState, action: FormAction): FormState => {
        switch (action.type) {
            // Update field that user is typing in
            case 'UPDATE_FIELD':
                return {
                    ...state,
                    [action.field]: action.value
                }
            // Reset to intiial values
            case 'RESET_FORM':
                return initialFormState
            default:
                return state
        }
    }

    // To be able to use it, where state is the field and dispatch is the action
    const [state, dispatch] = useReducer(formReducer, initialFormState)

    // Handle changes to all inputs that are of type number and text, but with useReducer
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        const parsedValue = type === 'number' ? Number(value) : value

        dispatch({
            type: 'UPDATE_FIELD',
            field: name as keyof FormState,
            value: parsedValue
        })
    }

    // Handle file uploads, particularly images
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Code below is to ensure a decent sized image is being uploaded to prevent blurry images
            const img = new Image()
            img.src = URL.createObjectURL(file) // Create an temporarory image object so that I can check its demensions

            // When the image loads, add it if it meets dimension requirements. Otherwise, tell the user to choose a larger image
            img.onload = () => {
                if (img.width >= 500 && img.height >= 500) {
                    setPicture(file)
                }
                else {
                    alert('Image must be at least 500x500 pixels')
                }

                URL.revokeObjectURL(img.src) // Free up memory
            }

            e.target.value = '' // Allow the same file to be re-selected later
        }
    }

    const submitUser = async (): Promise<void> => {
        try {
            // Create formData object due to possible file upload
            const formData = new FormData()

            for (const key in state) {
                // Form data only accpets strings and blob? values, so everything is converted to string
                formData.append(key, state[key as keyof FormState].toString())
            }

            // In case admin does not want a profile picture
            if (profile_picture) {
                formData.append('profile_picture', profile_picture)
            }

            const res = await axios.post(`${SERVER_HOST}/users/add`, formData)

            if (!res || !res.data) {
                console.log(res.data.errorMessage)
            }
            else {
                // Update the state in the 'Users.tsx' component immediately
                updateUsers(res.data.newUser)

                alert(res.data.message)

                // Putting all state variables to their default values
                dispatch({ type: 'RESET_FORM' })

                // And also setting uploaded image to be null
                setPicture(null)
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
        }
    }

    return (
        <div className="crud-modal" id="add-user-modal">
            <div className="crud-modal-content">
                <div className="header">
                    <div className="close" onClick={() => closeSlideInModal("add-user-modal")}>
                        <img src="/images/close-icon.png" />
                    </div>

                    <h4>Add User</h4>

                    <div className="submit">
                        <button onClick={() => submitUser()}>Submit</button>
                    </div>
                </div>

                <form>
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e)}
                    />

                    {profile_picture !== null ? (
                        <img 
                            src={URL.createObjectURL(profile_picture)} 
                            className="profile-picture"
                            onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                    ) : (
                        <div onClick={() => openFile()} className="add-profile-picture">
                        <img
                            src="/images/high-res-upload-image-icon.png"
                            alt="Add photo button"
                        />
                    </div>
                    )}

                    <div className="input-container">
                        <b>First Name</b>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="20 characters max"
                            className="text-input"
                            autoComplete="off"
                            value={state.firstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container">
                        <b>Last Name</b>

                        <input
                            type="text"
                            name="lastName"
                            placeholder="30 characters max"
                            className="text-input"
                            autoComplete="off"
                            value={state.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container">
                        <b>Email</b>

                        <input
                            type="text"
                            name="email"
                            className="text-input"
                            autoComplete="off"
                            value={state.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container">
                        <b>Password</b>

                        <input
                            type="text"
                            name="password"
                            placeholder="Minimum 8 characters"
                            className="text-input"
                            autoComplete="off"
                            value={state.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container">
                        <b>Role</b>

                        <div className="radio-container">
                            <div>
                                <p>Guest</p>

                                <input
                                    type="radio"
                                    name="accessLevel"
                                    value="0"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <p>User</p>

                                <input
                                    type="radio"
                                    name="accessLevel"
                                    value="1"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <p>Admin</p>

                                <input
                                    type="radio"
                                    name="accessLevel"
                                    value="2"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-container">
                        <b>Telephone No.</b>

                        <input
                            type="text"
                            name="telephoneNo"
                            placeholder="Irish phone numbers only"
                            className="text-input"
                            autoComplete="off"
                            value={state.telephoneNo}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container">
                        <b>Eircode</b>

                        <input
                            type="text"
                            name="houseAddress"
                            placeholder="Irish eircodes only"
                            className="text-input"
                            autoComplete="off"
                            value={state.houseAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUser
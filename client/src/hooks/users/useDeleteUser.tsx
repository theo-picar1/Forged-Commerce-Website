import React, { useState } from "react"

import axios from "axios"
import { SERVER_HOST } from "../../config/global_constants"

export const useDeleteUser = (isAdmin: boolean) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const deleteUser = async (userId: string): Promise<void> => {
        if(!userId || !isAdmin) return

        try {
            setLoading(true)

            const res = await axios.delete(`${SERVER_HOST}/users/${userId}`)

            if(!res || !res.data) {
                return
            }

            console.log("Successfully deleted product!")

            return
        }
        catch(error: any) {
            if(error.response.data.errorMessage) {
                setError(error.response.data.errorMessage)
            }
            else {
                setError(error)
            }
        }
        finally {
            setLoading(false)
        }
    }

    return { loading, error, deleteUser }
}
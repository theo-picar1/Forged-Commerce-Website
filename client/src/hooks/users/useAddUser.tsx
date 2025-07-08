import { useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

import { User } from '../../types/User'

export const useAddUser = () => {
    // State variables
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const addUser = async (formData: FormData): Promise<void> => {
        if(!formData) return // Nothing to add

        setLoading(true)
        setError(null)

        try {
            const res = await axios.post(`${SERVER_HOST}/users/add`, formData)

            if (!res || !res.data) {
                return
            }

            setUsers(res.data.users)
            console.log(res.data.message)

            return
        }
        catch (error: any) {
            if (error.response.data.errorMessage) {
                setError(error.response.data.errorMessage)
            }
            else {
                setError(error)
            }

            return
        }
        finally {
            setLoading(false)
        }
    }

    return { users, loading, error, addUser }
}
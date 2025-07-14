import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from '../../config/global_constants'

import { User } from '../../types/User'

export const useFetchUsers = (isAdmin: boolean) => {
    // State variables
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = useCallback(async (): Promise<void> => {
        if(!isAdmin) return // Only admins can access data
        
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/users`)

            if (!res || !res.data) {
                return
            }
            else {
                setUsers(res.data.users)
                console.log(res.data.message)
            }

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
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [])

    return { users, loading, error, fetchUsers }
}
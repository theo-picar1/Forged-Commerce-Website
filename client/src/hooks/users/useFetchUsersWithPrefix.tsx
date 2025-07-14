import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { User } from '../../types/User'

// Hook for retrieving all users from DB
export const useFetchUsersWithPrefix = (searchPrefix: string) => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsersWithPrefix = useCallback(async (): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/users/search/${searchPrefix}`)

            // Send anyways even if there are no matchning users
            setUsers(res.data.users)
        }
        catch (err: any) {
            setError(err.response.data.errorMessage)
        }
        finally {
            setLoading(false)
        }
    }, [searchPrefix]) // Call again when prefix changes

    useEffect(() => {
        fetchUsersWithPrefix()
    }, [fetchUsersWithPrefix]) // Create new reference if prefix changes in function above

    return { users, loading, error, fetchUsersWithPrefix }
}
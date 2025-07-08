import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Purchases } from '../../types/Purchases'

export const useFetchHistory = (userId: string) => {
    const [purchases, setPurchases] = useState<Purchases[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchHistory = useCallback(async (): Promise<void> => {
        if(!userId) return // User is not signed in, don't trigger function

        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(`${SERVER_HOST}/purchases/${userId}`)

            if (!res || !res.data) {
                return
            }

            console.log(res.data)
            
            setPurchases(res.data.purchases) // Get the purchases nested inside the History type. 'refer to /types/Purchases.ts'
        }
        catch (error: any) {
            if (error.response?.data?.errorMessage) {
                setError(error.response.data.errorMessage)
            }
            else {
                setError(error)
            }
        }
        finally {
            setLoading(false)
        }
    }, [userId]) // Run again if different user is signed in

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    return { purchases, loading, error, fetchHistory }
}
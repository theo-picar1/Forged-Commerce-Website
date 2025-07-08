import { useCallback, useEffect, useState } from 'react'

// axios
import axios from 'axios'
import { SERVER_HOST } from '../../config/global_constants'

// types
import { Product } from '../../types/Product'

// Hook for retrieving all products from DB
export const useFetchProductsWithPrefix = (searchPrefix: string) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProductsWithPrefix = useCallback(async (): Promise<void> => {
		setLoading(true)
		setError(null)

		try {
			const res = await axios.get(`${SERVER_HOST}/products/search/${searchPrefix}`)

			// Send anyways even if there are no matchning products
			setProducts(res.data.products)
		}
		catch (err: any) {
			setError(err.response.data.errorMessage)
		}
		finally {
			setLoading(false)
		}
	}, [searchPrefix]) // Call again when prefix changes

	useEffect(() => {
		fetchProductsWithPrefix()
	}, [fetchProductsWithPrefix]) // Create new reference if prefix changes in function above

	return { products, loading, error, refetch: fetchProductsWithPrefix }
}
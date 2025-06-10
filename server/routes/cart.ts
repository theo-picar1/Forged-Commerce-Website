import express, { Request, Response } from 'express'
import cartModel from '../models/cart.ts'

const router = express.Router()

// To get a user's cart based on the user's id
router.get('/cart/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId

        let cart = await cartModel.findOne({ user: userId }).populate('products.product')

        // Create new cart if none exists
        if (!cart) {
            cart = await cartModel.create({ user: userId, products: [] })

            // Populate product refs (even if empty)
            cart = await cartModel.findById(cart._id).populate('products.product')
        }

        res.status(200).json(cart) // Don't add { } since that makes it another object when doing res.data

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Failed to fetch cart' })

        return
    }
})

// Add a product to a matching user's shopping cart
router.post('/cart/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body
        const userId = req.params.userId

        const matchedCart = await cartModel.findOne({ user: userId })

        if (matchedCart) {
            // Logic for incrementing a product's quantity when adding it again (i.e already in the user's cart)
            const existingProduct = matchedCart.products.find(p => p.product.equals(productId))

            // If it exists, just make the quantity = the passed in quantity
            if (existingProduct) {
                existingProduct.quantity = quantity
            }
            // Otherwise push it first and then give the quanitty a value
            else {
                matchedCart.products.push({ product: productId, quantity: quantity })
            }

            await matchedCart.save()

            res.status(200).json({ message: 'Product added to existing cart' })

            return
        }
        else {
            res.status(404).json({ errorMessage: 'Cart not found!' })

            return
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Failed to add product to shopping cart' })

        return
    }
})

router.delete('/cart/:userId/:productId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId
        const productId = req.params.productId

        const matchedCart = await cartModel.findOne({ user: userId })

        matchedCart?.products.map(product => console.log(product))

        if (matchedCart) {
            // This is to see if the product was deleted or not
            const initialLength = matchedCart.products.length

            matchedCart.products = matchedCart.products.filter(cartProduct => !cartProduct.product.equals(productId))

            // If the lenghts are the same then the product was not delete
            if (initialLength === matchedCart.products.length) {
                res.status(404).json({ errorMessage: 'Unable to delete product from cart!' })
                return
            }

            // Otherwise, sae the newly updated user's cart to MongoDB
            await matchedCart.save()

            res.status(200).json({ message: 'Product deleted from cart!' })

            return
        }
        else {
            res.status(404).json({ errorMessage: 'Cart not found!' })

            return
        }
    }
    catch (error) {
        console.error("Super duper bad error")
        res.status(500).json({ errorMessage: 'Failed to remove product from shopping cart' })

        return
    }
})

export default router
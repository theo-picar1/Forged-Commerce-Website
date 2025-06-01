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

        res.status(200).json({ cart })

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

            // Then after updating the user's cart, populate the products with all their fields as it refs the Products database
            const populatedCart = await cartModel.findById(matchedCart._id).populate('products.product')

            res.status(200).json({ message: 'Product added to existing cart', cart: populatedCart })

            return
        }
        // Otherwise I need to make a new cart just for them, and then add the product to their cart
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

export default router
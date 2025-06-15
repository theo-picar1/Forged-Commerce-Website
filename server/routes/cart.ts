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

        res.status(200).json(cart)

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

            // Send back a success message and also the updated cart length
            res.status(200).json({
                message: 'Product added to existing cart',
                updatedLength: matchedCart.products.length
            })

            return
        }
        else {
            res.status(404).json({ errorMessage: 'Cart not found!' })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Failed to add product to shopping cart' })

        return
    }
})

// To save all quantity changes to the user's products in their shopping cart
router.put('/cart/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId
        const { products } = req.body

        const matchedCart = await cartModel.findOne({ user: userId })

        if (matchedCart) {
            matchedCart.products = products

            await matchedCart.save()

            res.status(200).json({ message: 'Changes to quantities saved!' })

            return
        }
        else {
            res.status(404).json({ errorMessage: 'Could not find user\'s cart found!' })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Unable to save changes. Please try again later!' })

        return
    }
})

// To delete a product in a user's cart by product id
router.delete('/cart/:userId/:productId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId
        const productId = req.params.productId

        const matchedCart = await cartModel.findOne({ user: userId })

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

            res.status(200).json({
                message: 'Product deleted from cart!',
                updatedLength: matchedCart.products.length
            })

            return
        }
        else {
            res.status(404).json({ errorMessage: 'Cart not found!' })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Failed to remove product from shopping cart' })

        return
    }
})

// Function that will delete all items in the user's cart when they manage to checkout successfully
router.delete('/cart/:userId', async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId

    const matchedCart = await cartModel.findOne({ user: userId })

    if (matchedCart) {
        matchedCart.products = [] 
        
        await matchedCart.save()

        res.status(200).json({ errorMessage: "Successfully deleted items after check out!" })
    }
    else {
        res.status(404).json({ errorMessage: "Delete many error: Unable to find cart with userId" })
    }
})

export default router
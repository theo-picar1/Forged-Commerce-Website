import express, { Request, Response } from 'express'
import purchasesModel from '../models/purchases.ts'
import cartModel from "../models/cart.ts"

const router = express.Router()

// Get purchases history
router.get('/purchases/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId

        // All this does is get the user's purchase history if exists, otherwise make one for them with the passed in id and set purchases to be empty
        const purchaseHistory = await purchasesModel.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { purchases: [] } },
            { upsert: true, new: true }
        )

        res.status(200).json(purchaseHistory)

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Failed to fetch cart' })

        return
    }
})

// Post the user's cart and add it to the purchase history. Pretty much just checking out
router.post('/purchases/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { cartId, totalPrice } = req.body
        const userId = req.params.userId

        // Find the cart being posted to purchase history for reference
        const cart = await cartModel.findById(cartId).populate('products.product')  // adjust if your schema differs

        if (!cart) {
            res.status(404).json({ errorMessage: 'Cart not found' })
            return
        }

        // Then I make a copy of all of the cart's items as I am going to delete them if checkout is successfull
        const items = cart.products.map((item: any) => ({
            product_images: item.product.product_images,
            product_name: item.product.product_name,
            quantity: item.quantity,
            price: item.product.price
        }))

        const purchaseEntry = {
            items,
            purchased_at: new Date(),
            totalPrice: totalPrice
        }

        // Saving to user's purchase history
        await purchasesModel.findOneAndUpdate(
            { user: userId },
            { $push: { purchases: purchaseEntry } },
            { upsert: true, new: true }
        )

        // And then delete the cart afterwards so that user has a fresh cart
        await cartModel.findByIdAndDelete(cartId)

        res.status(200).json({ message: 'Checkout successful' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Failed to checkout!' })
    }
})


export default router

import express, { Request, Response } from 'express'
import purchasesModel from '../models/purchases.ts'
import mongoose from "mongoose"

const router = express.Router()

// Get purchases history
router.get('/purchases/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId

        // Populate the cart with its fields from the other table we 'ref' it from
        let purchaseHistory = await purchasesModel.findOne({ user: userId })

        // Create new purchase history table if none exists for the current user
        if (!purchaseHistory) {
            purchaseHistory = await purchasesModel.create({ user: userId, purchases: [] })

            purchaseHistory = await purchasesModel.findById(purchaseHistory._id)
        }

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
        const { cartId } = req.body
        const userId = req.params.userId

        const matchedHistory = await purchasesModel.findOne({ user: userId })

        if (matchedHistory) {
            const purchaseDate = new Date()

            matchedHistory.purchases.push({ cart: cartId, purchased_at: purchaseDate })

            await matchedHistory.save()

            res.status(200).json({ message: "Checkout successful " })

            return
        }
        else {
            res.status(404).json({ errorMessage: "Unable to checkout cart items! Please try again!" })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Failed to checkout!' })

        return
    }
})

export default router

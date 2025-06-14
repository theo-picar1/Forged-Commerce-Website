import express, { Request, Response } from 'express'
import purchasesModel from '../models/purchases.ts'

const router = express.Router()

// Get purchases history
router.get('/purchases/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId

        // Populate the cart with its fields from the other table we 'ref' it from
        let purchaseHistory = await purchasesModel.findOne({ user: userId }).populate('purchases.cart')

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
        const { cartId, purchaseDate } = req.body
        const userId = req.params.userId

        const matchedHistory = await purchasesModel.findOne({ user: userId })

        if (matchedHistory) {
            matchedHistory.purchases.push({ cart: cartId, purchased_at: purchaseDate })

            await matchedHistory.save()

            res.status(200).json({ message: "Successfully checked out items!" })
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

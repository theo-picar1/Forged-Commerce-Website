import express, { Request, Response } from "express"
import favouritesModel from "../models/favourites.ts"
import mongoose from "mongoose"

const router = express.Router()

// Reading all records 
router.get('/favourites/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        let favourites = await favouritesModel.findOne({ userId: userId }).populate('favourites')

        if (!favourites) {
            favourites = await favouritesModel.create({ userId: userId, favourites: [] })
            favourites = await favouritesModel.findById(favourites._id).populate('favourites')
        }

        res.status(200).json(favourites)

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Server error: Unable to retrive favourites for users" })
    }
})

// Add a product to user's favourites
router.post('/favourites/:userId/:productId', async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.params

        const matchedFav = await favouritesModel.findOne({ userId: userId })

        if(!matchedFav) {
            res.status(404).json({ errorMessage: "Could not find user's favourites" })

            return
        }

        const productObjectId = new mongoose.Types.ObjectId(productId)
        const initial = matchedFav.favourites.length

        matchedFav.favourites.push(productObjectId)

        if(initial == matchedFav.favourites.length) {
            res.status(400).json({ message: "Could not add to favourites. Please try again!" })

            return
        }

        await matchedFav.save()

        res.status(200).json({ favourites: matchedFav, message: "Product successfully added to favourites" })

        return
    }
    catch(error) {
        res.status(500).json({ errorMessage: "Server error: Unable to perform request for user"})

        return
    }
})

// Remove a favourite'd project
router.delete('/favourites/:userId/:productId', async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.params

        const matchedFav = await favouritesModel.findOne({ userId: userId })

        if(!matchedFav) {
            res.status(404).json({ errorMessage: "Could not find user's favourites" })

            return
        }

        const initial = matchedFav.favourites.length

        matchedFav.favourites = matchedFav.favourites.filter(fav => !fav.equals(productId))

        if(initial === matchedFav.favourites.length) {
            res.status(400).json({ errorMessage: "Favourite product was not successfully deleted" })

            return
        }

        await matchedFav.save()

        res.status(200).json({ favourites: matchedFav.favourites, message: "Product successfully removed from favourites "})

        return
    }
    catch(error) {
        res.status(500).json({ errorMessage: "Server error: Unable to perform request for user"})

        return
    }
})

export default router
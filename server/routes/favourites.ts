import express, { Request, Response } from "express"
import favouritesModel from "../models/favourites"

const router = express.Router()

// Reading all records 
router.get('/favourites/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        let favourites = await favouritesModel.findOne({ userId: userId }).populate('favourites.product')

        if (!favourites) {
            favourites = await favouritesModel.create({ userId: userId, favourites: [] })

            favourites = await favouritesModel.findById(favourites._id).populate('favourites.product')
        }

        res.status(200).json(favourites)

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Server error: Unable to retrive favourites for users" })
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
    }
    catch(error) {
        res.status(500).json({ errorMessage: "Server error: Unable to perform request for user"})
    }
})
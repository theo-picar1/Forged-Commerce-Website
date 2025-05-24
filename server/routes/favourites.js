const router = require(`express`).Router()
const favouriteModel = require(`../models/favourites`)

// Read one cart
router.get(`/favourite/:id`, (req, res) => {
    favouriteModel.findById(req.params.id, (error, data) => {
        res.json(data)
    })
})

module.exports = router
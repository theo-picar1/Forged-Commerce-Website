const router = require(`express`).Router()
const cartModel = require(`../models/cart`)

// Read one cart
router.get(`/cart/:id`, (req, res) => {
    cartModel.findById(req.params.id, (error, data) => {
        res.json(data)
    })
})

module.exports = router
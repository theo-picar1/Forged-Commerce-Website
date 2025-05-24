const router = require(`express`).Router()
const reviewModel = require(`../models/reviews`)

// Read one cart
router.get(`/review/:id`, (req, res) => {
    reviewModel.findById(req.params.id, (error, data) => {
        res.json(data)
    })
})

module.exports = router
const router = require(`express`).Router()
const productsModel = require(`../models/products`)

// read all records
router.get(`/products`, (req, res) => {
    productsModel.find((error, data) => {
        res.json(data)
    })
})


// Read one record
router.get(`/products/:id`, (req, res) => {
    productsModel.findById(req.params.id, (error, data) => {
        res.json(data)
    })
})


// Add new record
router.post(`/products`, (req, res) => {
    productsModel.create(req.body, (error, data) => {
        res.json(data)
    })
})


// Update one record
router.put(`/products/:id`, (req, res) => {
    productsModel.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
        res.json(data)
    })
})


// Delete one record
router.delete(`/products/:id`, (req, res) => {
    productsModel.findByIdAndRemove(req.params.id, (error, data) => {
        res.json(data)
    })
})

module.exports = router
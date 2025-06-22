import express, { Request, Response } from 'express'
import productsModel from '../models/products.ts'

const router = express.Router()

// Read all records
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await productsModel.find()

    res.json(products)

    return
  }
  catch (error) {
    res.status(500).json({ errorMessage: 'Failed to fetch products' })

    return
  }
})

// Read one record
router.get('/products/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productsModel.findById(req.params.id)

    if (!product) {
      res.status(404).json({ errorMessage: 'Product not found' })

      return
    }

    res.json(product)

    return
  }
  catch (error) {
    res.status(500).json({ errorMessage: 'Failed to fetch product' })

    return
  }
})

// Find a product by its ID and update its 'favourite' field. For the favourite functionality
router.put('/products/update-favourite/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    let matchedProduct = await productsModel.findById(id)

    if(!matchedProduct) {
      res.status(404).json({ errorMessage: "Unable to find matching product by ID" })

      return
    }
    else {
      // True will = false, false will = true 
      matchedProduct.favourite = !matchedProduct.favourite

      await matchedProduct.save()

      res.status(200).json({ errorMessage: "Successfully updated product's 'favourite' field" })

      return
    }
  }
  catch (error) {
    res.status(500).json({ errorMessage: 'Unable to perform request: Update product \'favourite\' field' })

    return
  }
})

export default router

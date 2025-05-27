import express, { Request, Response } from 'express'
import productsModel from '../models/products'  // No need to include `.ts` in import

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

export default router

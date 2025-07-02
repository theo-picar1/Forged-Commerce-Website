import express, { Request, Response } from 'express'
import multer from "multer"

import productsModel from '../models/products.ts'

import { validateFields } from '../middleware/validations.ts'

const router = express.Router()

// All product fields needed for validation 
const productFields: string[] = ['product_name', 'product_description', 'price', 'stock_quantity', 'discount']

// For storing file uploads
const storage = multer.diskStorage({
  // This is where files will be stored
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  // Image files will be given the following name
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

// Read all records
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await productsModel.find()

    res.json(products)

    return
  }
  catch (error) {
    res.status(500).json({ errorMessage: 'Server error: Failed to fetch products' })

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
    res.status(500).json({ errorMessage: 'Server error: Failed to fetch product' })

    return
  }
})

// To add a new product to the database
router.post('/products', upload.array('product_images'), async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all files from array and put them into const product_images
    const files = req.files as Express.Multer.File[]
    const product_images = files.map(file => file.filename)

    const {
      product_name,
      description,
      price,
      stock_quantity,
      brand_new,
      discount
    } = req.body

    // turn categories back into an array
    const categories = JSON.parse(req.body.categories)

    const newProduct = await productsModel.create({
      product_images,
      product_name,
      description,
      categories,
      price,
      stock_quantity,
      brand_new,
      discount
    })

    if (newProduct) {
      res.status(201).json({ message: `Product '${product_name}' was successfully created` })
    }
    else {
      res.status(404).json({ errorMessage: `Product '${product_name}' was not created` })
    }

    console.log("Done")

    return
  }
  catch (error) {
    res.status(500).json({ errorMessage: `Server error: Failed to add product - ${error}` })

    return
  }
})

export default router

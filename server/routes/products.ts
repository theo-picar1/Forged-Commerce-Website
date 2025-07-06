import express, { Request, Response } from 'express'
import multer from "multer"

// models
import productsModel from '../models/products.ts'
import cartModel from '../models/cart.ts'

// functions
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
    const category = JSON.parse(req.body.categories)

    const newProduct = await productsModel.create({
      product_images,
      product_name,
      description,
      category,
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

// Edit a product
router.put('/products/:id', upload.array('uploaded_images'), async (req: Request, res: Response): Promise<void> => {
  console.log(req.body)
  try {
    // Get all uploaded files (not the existing url's in the product)
    const files = req.files as Express.Multer.File[]
    const uploaded_images = files.map(file => file.filename)

    // Also get the web images that I originally set at start of project
    const web_images = JSON.parse(req.body.web_images)

    // Then I put the two as one array for saving to the MongoDB
    const product_images = [...uploaded_images, ...web_images]

    const category = JSON.parse(req.body.categories)

    const { id } = req.params

    // Find the product to update and update the fields passed in. Ignoring other fields that were not included in request body
    await productsModel.findByIdAndUpdate(id, {
      ...req.body,
      product_images,
      category
    })

    res.status(200).json({ message: "All new changes successfully saved for product" })
  }
  catch (error) {
    res.status(500).json({ errorMessage: "Unexpected edit product error: ", error })
    return
  }
})

// Delete one product by id
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deletedProduct = await productsModel.findByIdAndDelete(id)

    if (!deletedProduct) {
      res.status(404).json({ errorMessage: "Could not find and delete product" })
    }
    else {
      // Delete that product in everyone's cart
      await cartModel.updateMany(
        {}, // All carts
        { $pull: { products: { product: id } } } 
      )

      res.status(200).json({ message: "Product was successfully deleted!" })
    }

    return
  }
  catch (error) {
    res.status(500).json({ errorMessage: "Unexpected delete product error: ", error })
  }
})

export default router

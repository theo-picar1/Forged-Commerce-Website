// server.js
import './config/loadEnv.ts'

console.log('DB_NAME:', process.env.DB_NAME) // Should show actual value

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import createError from 'http-errors'

// Routes
import productsRouter from './routes/products.ts'
import usersRouter from './routes/users.ts'
import cartRouter from "./routes/cart.ts"
import purchasesRouter from "./routes/purchases.ts"
import favouritesRouter from "./routes/favourites.ts"

import './config/db.ts' // MongoDB connection file; make sure it's ESM or rename to .mjs

const app = express()

app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: process.env.LOCAL_HOST }))

// Routers
app.use(productsRouter)
app.use(usersRouter)
app.use(cartRouter)
app.use(purchasesRouter)
app.use(favouritesRouter)

// Port
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Connected to port ${process.env.SERVER_PORT}`)
})

// Error 404
app.use((req, res, next) => next(createError(404)))

// Other errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message)
  if (!err.statusCode) {
    err.statusCode = 500
  }
  res.status(err.statusCode).send(err.message)
})

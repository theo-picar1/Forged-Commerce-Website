// server.js
import dotenv from 'dotenv'
dotenv.config({ path: './config/.env' })

import './config/db.js' // MongoDB connection file; make sure it's ESM or rename to .mjs

import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import createError from 'http-errors'

// Routes
import productsRouter from './routes/products.ts'
import usersRouter from './routes/users.ts'

const app = express()

app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: process.env.LOCAL_HOST }))

// Routers
app.use(productsRouter)
app.use(usersRouter)

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

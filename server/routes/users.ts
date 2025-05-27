import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import usersModel from '../models/users.ts'

import { validateFields } from '../middleware/validations.ts'

const router = express.Router()

/* IMPORTANT. The 4 parameters of Request: 
    Request<
    Params = core.ParamsDictionary,  // URL params, like req.params
    ResBody = any,                  // Response body type
    ReqBody = any,                  // Request body type
    ReqQuery = core.Query           // Query string params, like req.query
    >

    Async: All I know is that I need this to await
    Await: Wait for something to finish off before moving on. In the older project it is the equivalent of .then
*/

const registerFields: string[] = ['email', 'password', 'firstName', 'lastName', 'telephoneNo', 'address']

// Registering a new user i.e. Adding
router.post('/users/register', validateFields(registerFields), async (req: Request, res: Response) => {
    try {
        // Getting the email and password from the JSON that was passed in and because I don't want to type req.body 1000 times
        const {
            firstName,
            lastName,
            email,
            telephoneNo,
            houseAddress,
            password
        } = req.body

        // Check if email already exists and say so if does
        const userExists = await usersModel.findOne({ email })
        if (userExists) {
            res.status(409).json({ errorMessage: 'This email is already in use!' })

            return
        }

        // Hash the password using the salt round value defined in .env. Otherwise fall back to 3 as a default value
        const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS || '3')
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create new user with all the fields
        const newUser = await usersModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            telephoneNo: telephoneNo,
            houseAddress: houseAddress,
            password: hashedPassword
        })
        res.status(201).json({ successMessage: 'User successfully registered with ID: ', userId: newUser._id })

        return
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Internal server error' })

        return
    }
})

export default router
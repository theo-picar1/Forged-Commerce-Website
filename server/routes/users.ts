import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import usersModel from '../models/users.ts'

import { validateFields } from '../middleware/validations.ts'
import { match } from 'assert'

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

const registerFields: any[] = ['email', 'password', 'firstName', 'lastName', 'telephoneNo', 'houseAddress', 'accessLevel']
const loginFields: string[] = ['email', 'password']

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
            password,
            accessLevel
        } = req.body

        // Check if email already exists and say so if does
        const userExists = await usersModel.findOne({ email })
        if (userExists) {
            res.status(409).json({ errorMessage: 'Email already in use!' })

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
            password: hashedPassword,
            accessLevel: accessLevel
        })
        res.status(201).json({ successMessage: 'User successfully registered with ID: ', userId: newUser._id })

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Internal server error' })

        return
    }
})

// Logging in a user
router.post('/users/login', validateFields(loginFields), async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Trying to see if the email that user entered even exists in the database
        const matchedUser = await usersModel.findOne({ email })

        if (matchedUser) {

            // This time, we compare the hash of both the password the user entered and the hashed password of the user with the matching email
            const correctPassword: boolean = await bcrypt.compare(password, matchedUser.password)

            // If they password matches, 
            if(correctPassword) {
                res.json({
                    firstName: matchedUser.firstName,
                    accessLevel: matchedUser.accessLevel
                })

                return
            }
            // Otherwise tell them that password was wrong
            else {
                res.status(401).json({ errorMessage: 'Invalid password!' })

                return
            }
        }
        // If no email was found in the database, then that email is not in use
        else {
            res.status(404).json({ errorMessage: 'This email does not exist' })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Internal server error' })

        return
    }
})

// For logging out a user. Don't need async because I am not using await inside the method
router.post(`/users/logout`, (req: Request, res: Response) => {       
    res.json({  })
})

export default router
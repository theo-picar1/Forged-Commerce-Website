import express, { Request, Response } from 'express'

import bcrypt from 'bcryptjs'
import multer from "multer"

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

const registerFields: any[] = ['email', 'password', 'firstName', 'lastName', 'telephoneNo', 'houseAddress', 'accessLevel']
const loginFields: string[] = ['email', 'password']

// For being able to upload files to a folder for later access
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: userStorage })

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
            firstName,
            lastName,
            email,
            telephoneNo,
            houseAddress,
            password: hashedPassword,
            accessLevel
        })

        //Get updated users
        const users = await usersModel.find()

        res.status(201).json({ users, successMessage: 'User successfully registered with ID: ', userId: newUser._id })

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: 'Register user error: ', error })
        console.error("Register user error: ", error)

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
            if (correctPassword) {
                res.json({
                    firstName: matchedUser.firstName,
                    accessLevel: matchedUser.accessLevel,
                    id: matchedUser._id
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
        res.status(500).json({ errorMessage: 'User login error: ', error })
        console.error("Login user error: ", error)

        return
    }
})

// Loggin in an admin
router.post('/users/admin/login', validateFields(loginFields), async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const admin = await usersModel.findOne({ email: process.env.ADMIN_EMAIL })

        if (admin && email === admin.email) {
            const valid = await bcrypt.compare(password, admin.password)

            if (valid) {
                res.status(200).json({
                    accessLevel: 2,
                    message: "Successfully logged in as administrator",
                    id: admin._id
                })
            }
            else {
                res.status(401).json({ errorMessage: "Invalid password was given." })
            }

            return
        }
        else {
            res.status(404).json({ errorMessage: "Could not find user with given email!" })

            return
        }
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Admin login error: ", error })
        console.error("Admin login error: ", error)

        return
    }
})

// For logging out a user. Don't need async because I am not using await inside the method
router.post(`/users/logout`, (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: "Successfully logged out!" })

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Logout error: ", error })
        console.error("Logout user error: ", error)

        return
    }
})

// To get all users
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await usersModel.find()

        if (!users) {
            res.status(404).json({ errorMessage: "Failed to retrieve users!" })
        }
        else {
            res.json({
                users,
                message: "Successfully retrieved all available users!"
            })
        }

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Get all users error: ", error })
        console.error("Get all user error: ", error)

        return
    }
})

// To add a new user to the database
router.post('/users/add', upload.single('profile_picture'), validateFields(registerFields), async (req: Request, res: Response) => {
    try {
        // Get profile picture that was chosen
        const image = req.file?.filename

        // Variables
        const {
            firstName,
            lastName,
            email,
            houseAddress,
            telephoneNo,
            password
        } = req.body

        // Turn accessLevel back to an int
        const accessLevel = parseInt(req.body.accessLevel)

        // Hash the password with the salt rounds defined in the .env file
        const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS || '3')
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create new user with all the fields
        const newUser = await usersModel.create({
            firstName,
            lastName,
            email,
            telephoneNo,
            houseAddress,
            password: hashedPassword,
            accessLevel,
            profile_picture: image
        })

        // Check first if it was even created
        if (!newUser) {
            res.status(404).json({ errorMessage: "Failed to add new user!" })
        }
        else {
            res.status(200).json({ 
                newUser,
                message: "Successfully added new user!" 
            })
        }

        return
    }
    catch (error) {
        res.status(500).json({ errorMessage: "Add user error: ", error })
        console.error("Add user error: ", error)

        return
    }
})

// Delete one user by their id
router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedUser = await usersModel.findByIdAndDelete(id)

        if(!deletedUser) {
            res.status(404).json({ errorMessage: "Failed to delete the user!" })
        }
        else {
            res.status(200).json({ errorMessage: "Successfully deleted user!" })
        }

        return
    }
    catch(error) {
        res.status(500).json({ errorMessage: "Delete user error: ", error})
        console.error("Delete user error: ", error)

        return
    }
})

export default router
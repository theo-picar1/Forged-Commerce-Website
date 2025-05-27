import { Request, Response, NextFunction } from 'express'

// Middleware that will check if all strings passed are filled in
export function validateFields(requiredFields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const field of requiredFields) {
            if (req.body) {
                if (!req.body[field]) {
                    res.status(400).json({ errorMessage: `${field} is required.` })

                    return
                }
            }
        }
        next()
    }
}
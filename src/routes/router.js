/**
 * Main router module.
 */
import express from 'express'
import createError from 'http-errors'
import { router as authRouter } from './authRouter.js'

export const router = express.Router()

router.use('/', authRouter)

router.use('*', (req, res, next) => {
  next(createError(404))
})
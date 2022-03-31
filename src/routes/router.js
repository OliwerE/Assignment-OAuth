/**
 * Main router module.
 */
import express from 'express'
import createError from 'http-errors'
import { router as authRouter } from './authRouter.js'
import { router as gitlabRouter } from './gitlabRouter.js'

export const router = express.Router()
router.use('/gitlab', gitlabRouter)
router.use('/', authRouter)

router.use('*', (req, res, next) => {
  next(createError(404))
})
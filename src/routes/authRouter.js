/**
 * Module represents auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/authController.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/', controller.login)
router.get('/auth/gitlab/callback', controller.gitlabCallback)

router.use('*', (req, res, next) => next(createError(404)))
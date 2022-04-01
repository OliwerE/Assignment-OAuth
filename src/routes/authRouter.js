/**
 * Module represents auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/authController.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/login', controller.login) // ToDo check inactive gitlab session
router.get('/refresh', (req, res, next) => controller.refreshToken(req, res, next)) // ToDo check inactive gitlab session
router.get('/gitlab/callback', (req, res, next) => controller.gitlabCallback(req, res, next)) // ToDo check inactive gitlab session

router.use('*', (req, res, next) => next(createError(404)))
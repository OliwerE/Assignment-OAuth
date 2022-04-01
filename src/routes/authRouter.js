/**
 * Module represents auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/authController.js'

/**
 * Check if gitlab token data doesn't exist.
 *
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @param {Function} next - Next function.
 */
const checkInactiveSession = (req, res, next) => {
  try {
    if (req.session.gitlabTokenData === undefined) {
      next()
    } else {
      next(createError(404))
    }
  } catch (err) {
    next(createError(500))
  }
}

/**
 * Check if gitlab token data exist.
 *
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @param {Function} next - Next function.
 */
const checkActiveSession = (req, res, next) => {
  try {
    if (req.session.gitlabTokenData) {
      next()
    } else {
      res.redirect('/auth/login')
    }
  } catch (err) {
    next(createError(500))
  }
}

export const router = express.Router()

const controller = new AuthController()

router.get('/login', checkInactiveSession, controller.login)
router.post('/logout', checkActiveSession, controller.logout)
router.get('/refresh', checkActiveSession, (req, res, next) => controller.refreshToken(req, res, next))
router.get('/gitlab/callback', checkInactiveSession, (req, res, next) => controller.gitlabCallback(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))

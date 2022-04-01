/**
 * Module represents gitlab router.
 */

import express from 'express'
import createError from 'http-errors'
import { GitlabController } from '../controllers/gitlabController.js'

/**
 * Check if gitlab token data exist.
 *
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @param {Function} next - Next function.
 */
const authorize = (req, res, next) => {
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

const controller = new GitlabController()

router.get('/', authorize, (req, res, next) => controller.index(req, res, next))
router.get('/activity', authorize, (req, res, next) => controller.activity(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))

/**
 * Module represents gitlab router.
 */

import express from 'express'
import createError from 'http-errors'
import { GitlabController } from '../controllers/gitlabController.js'

const authorize = (req, res, next) => {
  try {
    if (req.session.gitlabTokenData) {
      return next()
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

router.use('*', (req, res, next) => next(createError(404)))
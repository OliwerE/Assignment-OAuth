/**
 * Module represents gitlab router.
 */

import express from 'express'
import createError from 'http-errors'
import { GitlabController } from '../controllers/gitlabController.js'

export const router = express.Router()

const controller = new GitlabController()

router.get('/', controller.index)

router.use('*', (req, res, next) => next(createError(404)))
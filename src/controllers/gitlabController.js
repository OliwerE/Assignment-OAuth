/**
 * Module represents Gitlab Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Class represents Gitlab controller.
 */
export class GitlabController {
  index (req, res, next) { // ToDo auth before!
    console.log(req.session)
    console.log('test')
    res.render('body/index')
  }
}
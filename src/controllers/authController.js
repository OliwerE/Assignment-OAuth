/**
 * Module represents Auth Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Class represents auth controller.
 */
export class AuthController {
  login (req, res, next) {
    try {
      if (req.session.gitlabTokenData) {
        res.redirect('/gitlab')
      } else {
        res.render('body/auth/login')
      }
    } catch (err) {
      next(createError(500))
    }
  }

  async gitlabCallback (req, res, next) {
    try {
      const code = req.query.code
      if (code) {
        await fetch(`https://gitlab.lnu.se//oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST"
          }).then(res => {
            return res.json()
          }).then(json => {
            req.session.gitlabTokenData = json
            res.redirect('/gitlab')
          }).catch(err => {
            console.log(err)
          })
      } else {
        next(createError(500))
      }
    } catch (err) {
      next(createError(500))
    }
  }
}
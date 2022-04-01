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
      res.render('body/login')
    } catch (err) {
      next(createError(500))
    }
  }

  async gitlabCallback (req, res, next) {
    try {
      const code = req.query.code
      if (code) {
        const tokenData = await this.#fetchData(`https://${process.env.GITLAB_BASE_URL}/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`, 'POST')

        req.session.gitlabTokenData = tokenData
        res.redirect('/')
      } else {
        next(createError(500))
      }
    } catch (err) {
      next(createError(500))
    }
  }

  async #fetchData(url, method) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: method
    }).then(res => {
      return res.json()
    }).then(json => {
      return json
    }).catch(err => {
      console.log(err)
    })
  }

  async refreshToken(req, res, next) {
    try {
      const tokenData = this.#fetchData(`https://${process.env.GITLAB_BASE_URL}/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${req.session.gitlabTokenData.refresh_token}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`, 'POST')

      req.session.gitlabTokenData = tokenData
      res.redirect('/')
    } catch (err) {
      next(createError(500))
    }
  }
}
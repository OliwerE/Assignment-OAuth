/**
 * Module represents Auth Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Class represents auth controller.
 */
export class AuthController {
  /**
   * Login user.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
  login (req, res, next) {
    try {
      const viewData = {
        uri: `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=STATE&scope=${process.env.SCOPE}`,
        hideLogout: true
      }
      res.render('body/login', { viewData })
    } catch (err) {
      next(createError(500))
    }
  }

  /**
   * Logout user.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
  logout (req, res, next) {
    try {
      req.session.destroy()
      res.redirect('/auth/login')
    } catch (err) {
      next(createError(500))
    }
  }

  /**
   * Store gitlab token using callback code.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
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

  /**
   * Fetch JSON data from an url using a HTTP method.
   *
   * @param {string} url - Url to fetch.
   * @param {string} method - HTTP method.
   * @returns {JSON} - Response data.
   */
  async #fetchData (url, method) {
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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

  /**
   * Updates gitlab token using refresh token.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
  async refreshToken (req, res, next) {
    try {
      const tokenData = await this.#fetchData(`https://${process.env.GITLAB_BASE_URL}/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${req.session.gitlabTokenData.refresh_token}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`, 'POST')
      req.session.gitlabTokenData = tokenData
      res.redirect('/')
    } catch (err) {
      next(createError(500))
    }
  }
}

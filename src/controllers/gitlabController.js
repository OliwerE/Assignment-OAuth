/**
 * Module represents Gitlab Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Class represents Gitlab controller.
 */
export class GitlabController {
  async #fetchData (url, method, authorization) {
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authorization
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

  async index (req, res, next) { // ToDo auth before!
    try {
      const user = await this.#fetchData('https://gitlab.lnu.se/api/v4/user', 'GET', req.session.gitlabTokenData.access_token)

      if (user.error === 'invalid_token') {
        res.redirect('/auth/refresh')
      } else {
        const { name, username, id, email, avatar_url, last_activity_on } = user // last_activity_on ska ha tid?? sakans!

        const viewData = {
          name,
          username,
          id,
          email,
          avatar_url,
          last_activity_on
        }
        res.render('body/index', { viewData })
      }
    } catch (err) {
      createError(500)
    }
  }
}
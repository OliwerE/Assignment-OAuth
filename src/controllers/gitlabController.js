/**
 * Module represents Gitlab Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Class represents Gitlab controller.
 */
export class GitlabController {
  async index (req, res, next) { // ToDo auth before!
    try {
      // console.log(req.session)
      // console.log('test')

      // Get name, username, user id, primary email, avatar incl gravatar, last activity on (date & time)
      console.log(req.session.gitlabTokenData.access_token)
      await fetch('https://gitlab.lnu.se/api/v4/user', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + req.session.gitlabTokenData.access_token
        },
        method: "GET"
      }).then(res => {
        return res.json()
      }).then(json => {
        const { name, username, id, email, avatar_url, last_activity_on } = json // last_activity_on ska ha tid?? sakans!
        // console.log(json)

        const viewData = {
          name,
          username,
          id,
          email,
          avatar_url,
          last_activity_on
        }
        res.render('body/index', { viewData })
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      createError(500)
    }
  }
}
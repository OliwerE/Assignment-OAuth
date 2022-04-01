/**
 * Module represents Gitlab Controller
 */

import createError from 'http-errors'
import fetch from 'node-fetch'
import moment from 'moment'

/**
 * Class represents Gitlab controller.
 */
export class GitlabController {
  async #fetchData (url, method, authorization) {
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authorization
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

  async index (req, res, next) {
    try {
      const user = await this.#fetchData(`https://${process.env.GITLAB_BASE_URL}/api/v4/user`, 'GET', req.session.gitlabTokenData.access_token)

      if (user.error === 'invalid_token') {
        res.redirect('/auth/refresh')
      } else {
        // eslint-disable-next-line camelcase
        const { name, username, id, email, avatar_url, last_activity_on } = user

        const viewData = {
          csrfToken: req.csrfToken(),
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

  async activity (req, res, next) {
    try {
      const page = req.query.page || '1'

      if (page < 1) {
        next(createError(404))
      } else {
        const events = await this.#fetchData(`https://${process.env.GITLAB_BASE_URL}/api/v4/events?per_page=50&page=${page}`, 'GET', req.session.gitlabTokenData.access_token)
        if (events.length === 0) {
          next(createError(404))
        } else {
          const activities = events.map(e => ({
            projectId: e.project_id,
            action: e.action_name,
            type: e.target_type,
            title: e.target_title,
            commitTitle: (e.push_data !== null && e.push_data !== undefined ? e.push_data.commit_title : undefined),
            createdAt: moment(e.created_at).fromNow()
          }))

          const viewData = {
            csrfToken: req.csrfToken(),
            activities,
            prev: parseInt(page) - 1,
            next: parseInt(page) + 1
          }
          res.render('body/activity', { viewData })
        }
      }
    } catch (err) {
      next(createError(500))
    }
  }
}

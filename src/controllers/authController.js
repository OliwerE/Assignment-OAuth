/**
 * Module represents Auth Controller
 */

/**
 * Class represents auth controller.
 */
export class AuthController {
  login (req, res, next) {
    res.render('body/auth/login')
  }

  gitlabCallback (req, res, next) {
    console.log(req.query)
    res.render('body/auth/callback')
  }
}
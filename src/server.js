/**
 * Express server module.
 */

import express from 'express'
import helmet from 'helmet'
import csurf from 'csurf'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import hbs from 'express-hbs'
import { router } from './routes/router.js'
import { connectMongoDB } from './config/mongoose.js'

async function run () {
  const app = express()
  await connectMongoDB(app)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ['self'],
        'script-src': ['self', 'https://gitlab.lnu.se/', 'cdn.jsdelivr.net'],
        'img-src': ['self', 'https://gitlab.lnu.se/', '*.gravatar.com', 'cdn.jsdelivr.net']
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
  })
  )
  app.use(logger('dev'))

  const fullDirName = dirname(fileURLToPath(import.meta.url))
  app.engine('hbs', hbs.express4({
    defaultLayout: join(fullDirName, 'views', 'layouts', 'default'),
    partialsDir: join(fullDirName, 'views', 'partials')
  }))
  app.set('view engine', 'hbs')
  app.set('views', join(fullDirName, 'views'))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(join(fullDirName, '..', 'public')))
  app.use(csurf({}))

  // Csurf
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    return res.status(403).sendFile(join(fullDirName, 'views', 'errors', '403.html'))
  })

  app.use('/', router)

  app.use((err, req, res, next) => {
    if (err.status === 401) {
      return res.status(401).sendFile(join(fullDirName, 'views', 'errors', '401.html'))
    }

    if (err.status === 403) {
      return res.status(403).sendFile(join(fullDirName, 'views', 'errors', '403.html'))
    }

    if (err.status === 404) {
      return res.status(404).sendFile(join(fullDirName, 'views', 'errors', '404.html'))
    }

    if (err.status === 500) {
      return res.status(500).sendFile(join(fullDirName, 'views', 'errors', '500.html'))
    }
  })

  app.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}
run()

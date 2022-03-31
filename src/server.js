/**
 * Express server module.
 */

import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import hbs from 'express-hbs'
import { router } from './routes/router.js'
import { connectMongoDB } from './config/mongoose.js'

async function run () {
  const app = express()
  await connectMongoDB(app)
  app.use(helmet())
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

  app.use('/', router)

  app.use((err, req, res, next) => {
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

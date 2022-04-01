
/**
 * Mongoose configuration module.
 */

import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'

/**
 * Mongoose and session configuration.
 *
 * @param {Function} app - Express application.
 */
export const connectMongoDB = async (app) => {
  // Mongoose configuration
  mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected.')
  })
  mongoose.connection.on('error', (error) => {
    console.log(`A mongoose connection error has occured: ${error}`)
  })
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected.')
  })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose is disconnected because of application termination.')
      process.exit(0)
    })
  })

  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // Session configuration

  const MongoDBSessionStore = MongoStore(session)

  const options = {
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    },
    store: new MongoDBSessionStore({ mongooseConnection: mongoose.connection, clear_interval: 3600 })
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    options.cookie.secure = true
  }

  app.use(session(options))
}

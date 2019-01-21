import 'dotenv/config'
import express from 'express'
import next from 'next'
import { parse } from 'url'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import featurePolicy from 'feature-policy'
import compression from 'compression'
import timeout from 'express-timeout-handler'
import ExpressBrute from 'express-brute'
import RedisStore from 'express-brute-redis'
import moment from 'moment'
import { json } from 'body-parser'
import { connect } from 'mongoose'
import passport from 'passport'
import passportConfig from './config/passport'
import { join } from 'path'

// Development packages
import volleyball from 'volleyball'

// Load Routes
import routes from './routes'
import { users, profile, posts } from './routes/api'
import { errorRespone } from './validation/ErrorHelper'

// ENV Vars
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_TEST,
  APP_PORT,
  NODE_ENV
} = process.env

const app = next({ dir: './client', dev: NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    // MiddleWare
    server.use(
      helmet({
        referrerPolicy: { policy: 'same-origin' },
        contentSecurityPolicy: {
          directives: {
            blockAllMixedContent: true,
            // defaultSrc: ["'self'"],
            // styleSrc: ["'self'"],
            // scriptSrc: ["'self'"],
            imgSrc: ["'self'"],
            objectSrc: ["'none'"],
            fontSrc: ["'self'"],
            frameSrc: ["'self'"]
          },
          disableAndroid: true
        }
      })
    )
    server.use(
      featurePolicy({
        features: {
          fullscreen: ["'self'"],
          vibrate: ["'self'"],
          payment: ["'self'"],
          syncXhr: ["'none'"]
        }
      })
    )

    const store = new RedisStore({
      host: '127.0.0.1',
      port: 6379
    })

    const failCallback = (_req, res, _next, nextValidRequestDate) => {
      errorRespone(
        'Rate limit',
        `You've made too many failed attempts in a short period of time, please try again later in ${moment(
          nextValidRequestDate
        ).fromNow()}`,
        res,
        429
      )
    }
    const handleStoreError = error => {
      console.error(error)
      throw new Error({
        message: error.message,
        parent: error.parent
      })
    }
    const bruteforce = new ExpressBrute(store, {
      freeRetries: 1000,
      attachResetToRequest: false,
      refreshTimeoutOnRequest: false,
      minWait: 5 * 60 * 1000, // 5 minutes
      maxWait: 60 * 60 * 1000, // 1 hour,
      failCallback,
      handleStoreError,
      lifetime: 24 * 60 * 60
    })

    server.set('trust proxy', 1)

    server.use(
      timeout.handler({
        timeout: 5000,
        onTimeout: (_req, res) => {
          return errorRespone(
            'Service timedout',
            'Service unavailable. Please retry',
            res,
            503
          )
        }
      })
    )
    server.use(favicon(join(__dirname, 'public', 'img', 'favicon.png')))
    server.use(json())
    server.use(compression())
    // Passport MiddlewARE
    server.use(passport.initialize())
    passportConfig()

    // Development MiddleWare
    if (NODE_ENV === 'development') {
      server.use(volleyball)
    }

    // Connect to Database
    const DB = process.env.NODE_ENV === 'test' ? DB_TEST : DB_NAME
    const options = { useNewUrlParser: true }
    connect(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB}`,
      options
    ).then(() => {
      console.log('- Database Connected...')
      const port = APP_PORT || 3000
      server.listen(port, () =>
        console.log(`- Server Started On http://localhost:${port}`)
      )

      // Routes
      server.use('/api/user', users)
      server.use('/api/profile', profile)
      server.use('/api/post', posts)
      server.get('*', bruteforce.prevent, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query = {} } = parsedUrl
        const route = routes[pathname]
        if (route) {
          return app.render(req, res, route.page, query)
        }
        handle(req, res)
      })
      server.use((err, _req, res, next) => {
        if (err.status === 400) {
          return errorRespone(err.name, err.message, res, 400)
        }
        return next(err)
      })
    })
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

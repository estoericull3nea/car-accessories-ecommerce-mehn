require('dotenv').config()

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const session = require('express-session')
const flash = require('connect-flash')
const compression = require('compression')
const helmet = require('helmet')
const MongoDBSession = require('connect-mongodb-session')(session)

const app = express()

const static_path = path.join(__dirname, './public')
const template_path = path.join(__dirname, './templates/views')

// const RateLimit = require('express-rate-limit')
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1min
//   max: 20, // 30 request per minute
// })

const store = new MongoDBSession({
  uri: process.env.MONGODB_URI_COMPASS,
  collection: 'user sessions',
})

// setting middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 3600000 }, // expires in 1hr
    saveUninitialized: false,
    resave: false,
    store: store,
  })
)
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})
app.use(compression())
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

app.use(express.static(static_path))
app.set('view engine', 'ejs')
app.set('views', template_path)

app.use('/', require('./routes/indexRoute'))
app.use('/auth', require('./routes/userRoute'))

const start = () => {
  try {
    require('./db/connect')(process.env.MONGODB_URI_COMPASS)
    app.listen(PORT, () => {
      console.log(`Server Running`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()

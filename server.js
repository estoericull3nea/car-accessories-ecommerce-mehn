require('dotenv').config()

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const session = require('express-session')
const flash = require('connect-flash')
const compression = require('compression')
const helmet = require('helmet')

const app = express()

// setting middlewares
app.use(express.json())
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 3600000 }, // expires in 1hr
    saveUninitialized: false,
    resave: false,
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

app.use(express.static(path.join(__dirname, './public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

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

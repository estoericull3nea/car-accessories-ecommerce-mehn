if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const app = express()

const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000
const myRoutes = require('./routes/routes')

const static_path = path.join(__dirname, './public')
const template_path = path.join(__dirname, './templates/views')

// setting connection
mongoose
  .connect(process.env.MONGODB_URI_COMPASS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection success')
  })
  .catch((e) => {
    console.log(`connection failed ${e}`)
  })

// setting middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// setting path
app.use(express.static(static_path))
app.set('view engine', 'ejs')
app.set('views', template_path)

// routes
app.use('/', myRoutes)

// if listening
app.listen(PORT, () => {
  console.log(`App is running on port: http://localhost:${PORT}`)
})

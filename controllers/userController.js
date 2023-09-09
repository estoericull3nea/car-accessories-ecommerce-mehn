const bcrypt = require('bcryptjs')
const User = require('../models/user')

const { createToken } = require('../config/auth')
const Product = require('../models/product')

// getting
const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Sign In', message: req.flash('message') })
}

const getRegister = (req, res) => {
  res.render('register', {
    pageTitle: 'Sign Up',
    message: req.flash('message'),
  })
}

const postRegister = async (req, res) => {
  try {
    // vars
    const { username, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })
    const errors = []

    // validations
    if (!username || !email || !password || !confirmPassword) {
      errors.push({ msg: 'All fields is required!' })
    }
    if (password !== confirmPassword) {
      errors.push({ msg: 'Password not match!' })
    }
    if (password.length < 6) {
      errors.push({ msg: 'Password must atleast 6 chars!' })
    }
    if (user) {
      errors.push({ msg: 'Email already registered!' })
    }
    if (errors.length > 0) {
      return res.render('register', {
        errors,
        username,
        email,
        password,
        confirmPassword,
        pageTitle: 'Register',
      })
    }

    // validations passed
    const hashedPass = await bcrypt.hash(password, 10)
    const userToAdd = new User({
      username,
      email,
      password: hashedPass,
      address: '',
    })

    await userToAdd.save()

    req.flash('success_msg', 'You are now Registered!')
    res.redirect('/auth/login')
  } catch (error) {
    console.log(error.message)
  }
}

const postLogin = async (req, res) => {
  try {
    res.clearCookie('access_token') // clearing cookie then replace by new one

    // vars
    const { email, password } = req.body
    const errors = []

    // validations
    if (!email || !password) {
      errors.push({ msg: 'All fields is required!' })
      return res.render('login', {
        errors,
        email,
        password,
        pageTitle: 'Login',
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      errors.push({ msg: 'Email not registered!' })
      return res.render('login', {
        errors,
        email,
        password,
        pageTitle: 'Login',
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      errors.push({ msg: 'Password not match!' })
    }

    if (errors.length > 0) {
      return res.render('login', {
        errors,
        email,
        password,
        pageTitle: 'Login',
      })
    }

    // validations passed
    const access_token = createToken(user) // creating cookie when login
    res.cookie('access_token', access_token, {
      maxAge: 3600000, // 1hr
      httpOnly: true, // can't access in client side
      secure: true,
    })

    req.session.isAuth = true // setting isAuth to true for validation purposes
    req.session.user = user

    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const usingMiddleware = async (req, res, next) => {
  try {
    if (req.session.user) {
      const findUserTest = await User.findById({ _id: req.session.user._id })
      req.user = findUserTest

      next()
    } else {
      // res.redirect('/auth/login')
      // res.send('log in first')
      next()
    }
  } catch (error) {
    res.json(error.message)
  }
}

const getLogout = (req, res) => {
  res.clearCookie('access_token')
  req.session.destroy()
  // req.flash('success_msg', 'Logged out!')
  res.redirect('/auth/login')
}

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
  usingMiddleware,
}

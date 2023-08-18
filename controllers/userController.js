const bcrypt = require('bcryptjs')
const User = require('../models/User')

const { createToken } = require('../config/auth')

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
      errors.push({ msg: 'All fields are required!' })
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
      errors.push({ msg: 'All fields are required!' })
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

const addToCart = (req, res) => {
  // can't add to cart
  try {
    if (!req.session.user) {
      console.log(req.session.user._id)
      res.send('login first')
    } else {
      console.log(req.session.user._id)
      req.session.user
        .addToCart(req.body.id)
        .then(() => console.log('done'))
        .catch((err) => console.log(err))
    }
  } catch (error) {
    res.json(error.message)
  }
}

const getLogout = (req, res) => {
  res.clearCookie('access_token') // clearing session
  req.session.destroy() // clearing session
  // req.flash('success_msg', 'Logged out!')
  res.redirect('/auth/login')
}

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
  addToCart,
}

const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
    const { username, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })
    const errors = []

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
      age: '',
      gender: '',
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

    req.session.isAuth = true // setting isAuth to true for validation purposes
    req.session.user = user

    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const getLogout = (req, res) => {
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
}

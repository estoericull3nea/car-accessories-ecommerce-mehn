// for load env
require('dotenv').config()

// models
const User = require('../models/user')
const Product = require('../models/product')
const AddedList = require('../models/AddedList')
const UserMessage = require('../models/message')
const AllProducts = require('../models/allproduct')

// for email
const nodemailer = require('nodemailer')

// for stripe
const pk_test = process.env.PK_TEST
const sk_test = process.env.SK_TEST
const stripe = require('stripe')(sk_test)

// to hash pass
const bcrypt = require('bcrypt')

// get login page
const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Sign In', message: req.flash('message') })
}

// get register page
const getRegister = (req, res) => {
  res.render('register', {
    pageTitle: 'Sign Up',
    message: req.flash('message'),
  })
}

// create transport for email
let transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST,
  auth: {
    user: process.env.USER_AUTH_FOR_MAILER,
    pass: process.env.PASS_AUTH_FOR_MAILER,
  },
})

// verify transport
transporter.verify((err) => {
  if (err) {
    console.log(err)
  }
})

// post register
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

    // passed
    const hashedPass = await bcrypt.hash(password, 10)
    const userToAdd = new User({
      username,
      email,
      password: hashedPass,
    })
    await userToAdd.save()
    req.flash('success_msg', 'You are now Registered!')
    res.redirect('/login')
  } catch (error) {
    console.log(error.message)
  }

  // try {
  //   const { username, email, password, confirmPassword } = req.body
  //   const existingUser = await User.findOne({ email })
  //   if (existingUser) {
  //     req.flash('message', 'Email already registered.')
  //     res.redirect('/register')
  //   } else if (password.length < 6) {
  //     req.flash('message', 'Password must have at least 6 characters')
  //     res.redirect('/register')
  //   } else {
  //     if (password === confirmPassword) {
  //       const hashedPassword = await bcrypt.hash(password, 10)
  //       const newUser = new Register({
  //         fullName: req.body.fullName,
  //         username: req.body.username,
  //         email: req.body.email,
  //         password: hashedPassword,
  //       })
  //       await newUser.save()
  //       res.redirect('/login')
  //       // .then((user) => {
  //       //   const token = new Token({
  //       //     _userId: user._id,
  //       //     token: crypto.randomBytes(16).toString('hex'),
  //       //   })
  //       //   token.save().then((err) => {
  //       //     if (err) {
  //       //       console.log(err)
  //       //     }
  //       //     const mailOptions = {
  //       //       to: user.email,
  //       //       from: process.env.USER_AUTH_FOR_MAILER,
  //       //       subject: 'Acc Verification Token',
  //       //       html: `Please Verify Your Account by clicking this <a href="http://${req.headers.host}/confirmation/${token.token}">link</a>`,
  //       //     }
  //       //     transporter.sendMail(mailOptions, (err) => {
  //       //       if (err) {
  //       //         console.log('failed')
  //       //       }
  //       //       res.render('pleaseCheck')
  //       //     })
  //       //   }) // end token of save
  //       // }) // end of user save
  //     } else {
  //       req.flash('message', 'Password are not match')
  //       res.redirect('/register')
  //     }
  //   }
  // } catch (err) {
  //   res.status(400).send(err)
  // }
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
    // passed
    req.session.isAuth = true
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}

const getProducts = (_, res) => {
  res.render('products', { pageTitle: 'Products' })
}

const getOurTeam = (_, res) => {
  res.render('ourTeam', { pageTitle: 'Our Team' })
}

const getFAQ = (_, res) => {
  res.render('faq', { pageTitle: 'FAQ' })
}

const getTermsAndConditions = (_, res) => {
  res.render('terms_and_conditions', { pageTitle: 'Terms and Conditions' })
}

const getPrivacyPolicy = (_, res) => {
  res.render('privacy_policy', { pageTitle: 'Privacy Policy' })
}

const getAboutUs = (_, res) => {
  res.render('aboutUs', { pageTitle: 'About Us' })
}

const getHomepage = (_, res) => {
  Product.find().then((products) => {
    res.render('homepage', {
      prods: products,
      pageTitle: 'EA',
    })
  })
}

const postContactUsForm = (req, res) => {
  const { name, email, message } = req.body

  let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    auth: {
      user: process.env.USER_AUTH_FOR_MAILER,
      pass: process.env.PASS_AUTH_FOR_MAILER,
    },
  })

  const newMessage = new UserMessage({
    name,
    email,
    message,
  })

  newMessage.save().then(() => {
    const mailOptions = {
      to: process.env.MY_EMAIL,
      from: email,
      subject: 'User Queries! || New Contact Form',
      text: message,
    }

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log('failed')
      }
      res.render('sentMessage')
    })
  })
}

const getProfile = (req, res) => {
  const user = req.user
  res.render('profile', { pageTitle: 'Profile', user })
}

const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
}

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getProducts,
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
  postContactUsForm,
  getProfile,
  postLogout,
}

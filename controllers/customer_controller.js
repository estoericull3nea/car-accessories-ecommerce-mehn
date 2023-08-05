// for load env
require('dotenv').config()

const User = require('../models/user')
const Product = require('../models/product')
const AddedList = require('../models/AddedList')
const UserMessage = require('../models/message')
const AllProducts = require('../models/allproduct')

// for email
const nodemailer = require('nodemailer')
const Token = require('../models/token')
const crypto = require('crypto')

const jwt = require('jsonwebtoken')

// for stripe
const pk_test = process.env.PK_TEST
const sk_test = process.env.SK_TEST
const stripe = require('stripe')(sk_test)

// for user auth
const bcrypt = require('bcrypt')

// controllers
const gTempHomepage = (_, res) => {
  res.render('temp_homepage', { pageTitle: 'EA' })
}

const gLogin = (req, res) => {
  res.render('login', { pageTitle: 'Sign In', message: req.flash('message') })
}

const gRegister = (req, res) => {
  res.render('register', {
    pageTitle: 'Sign Up',
    message: req.flash('message'),
  })
}
// email service
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
// end of email service

const pRegister = async (req, res) => {
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

const pLogin = async (req, res) => {
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
    res.redirect('/home')
  } catch (error) {
    console.log(error)
  }
}

const usingMiddleware = async (req, res, next) => {
  const latestUser = await User.findOne().sort({ createdAt: -1 }).limit(1)
  if (!latestUser) {
    res.redirect('/register')
  } else {
    const userID = await latestUser._id

    await User.findById(userID)
      .then((userInDb) => {
        req.user = userInDb
        next()
      })
      .catch((err) => console.log(err))
  }
}

const pAddToCart = (req, res) => {
  req.user
    .addToCart(req.body.id)
    .then(() => res.redirect('/home#cart-section'))
    .catch((err) => console.log(err))
}

const gCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      res.render('cart', {
        cart: user.cart,
        pageTitle: 'Cart',
      })
    })
    .catch((err) => console.log(err))
}

const pDeleteItemCart = (req, res, _) => {
  req.user
    .removeCart(req.body.id)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

const gProduct = (_, res) => {
  res.render('products', { pageTitle: 'Products' })
}

const gOurTeam = (_, res) => {
  res.render('our_team', { pageTitle: 'Our Team' })
}

const pCart = async (req, res) => {
  try {
    const { imgURL, title, quantity, price, description } = req.body
    const newProd = new Product({
      imgURL,
      title,
      quantity,
      price,
      description,
    })

    const ifExist = await AddedList.findOne({ imgURL: imgURL })
    if (!ifExist) {
      const newProd2 = new AddedList({
        imgURL,
        title,
        quantity,
        price,
        description,
      })

      await newProd.save()
      await newProd2.save()

      res.redirect('/products#prods-area')
    } else {
      res.redirect('/products#prods-area')
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

const gFaq = (_, res) => {
  res.render('faq', { pageTitle: 'FAQ' })
}

const gTermsnConditions = (_, res) => {
  res.render('terms_and_conditions', { pageTitle: 'Terms and Conditions' })
}

const gPrivacyPolicy = (_, res) => {
  res.render('privacy_policy', { pageTitle: 'Privacy Policy' })
}

const gAboutUs = (_, res) => {
  res.render('about_us', { pageTitle: 'About Us' })
}

const gHome = (_, res) => {
  Product.find().then((products) => {
    res.render('main_homepage', {
      prods: products,
      pageTitle: 'EA',
    })
  })
}

const pContactUsForm = (req, res) => {
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

const gSearchItem = (req, res) => {
  const titleItem = req.query.searchItem

  AllProducts.find({ title: titleItem }).then((prods) => {
    console.log(prods)
    res.render('searchItem', {
      pageTitle: 'Search Products',
      prods,
      titleItem,
    })
  })
}

const gProfile = (req, res) => {
  const user = req.user
  res.render('profile', { pageTitle: 'Profile', user })
}

const pLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
}
const pPayment = async (req, res) => {
  await stripe.customers
    .create({
      email: req.body.email,
      source: req.body.stripeToken,
    })
    .then((customer) => {
      stripe.charges
        .create({
          amount: 100 * 5,
          description: 'test description',
          currency: 'usd',
          customer: customer.id,
        })
        .then(() => {
          req.user.removeAllCart(req.user.id).then(() => {
            AddedList.deleteMany({})
              .then(() => {
                console.log('All items removed')
              })
              .catch((err) => {
                console.error('Error removing items', err)
              })

            Product.deleteMany({})
              .then(() => {
                console.log('All items removed')
              })
              .catch((err) => {
                console.error('Error removing items', err)
              })

            res.render('payment_done')
          })
        })
    })
}

module.exports = {
  gTempHomepage,
  gLogin,
  gRegister,
  pRegister,
  pLogin,
  usingMiddleware,
  pAddToCart,
  gCart,
  pDeleteItemCart,
  gProduct,
  gOurTeam,
  pCart,
  gFaq,
  gTermsnConditions,
  gPrivacyPolicy,
  gAboutUs,
  gHome,
  pContactUsForm,
  gSearchItem,
  gProfile,
  pLogout,
  pPayment,
}

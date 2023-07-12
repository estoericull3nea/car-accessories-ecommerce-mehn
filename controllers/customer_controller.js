if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Register = require('../models/register')
const Product = require('../models/product')
const AddedList = require('../models/added_list')
const UserMessage = require('../models/messageAboutUs')
const AllProducts = require('../models/all_prods')

const nodemailer = require('nodemailer')

const Token = require('../models/token')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const pk_test = process.env.PK_TEST
const sk_test = process.env.SK_TEST

const stripe = require('stripe')(sk_test)
const gTempHomepage = (_, res) => {
  res.render('temp_homepage', { pageTitle: 'Welcome to EA, Sign In First' })
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
transporter.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Ready For Messages')
    console.log(success)
  }
})
// end of email service

const pRegister = async (req, res) => {
  try {
    const { email } = req.body
    const password = req.body.password
    const cpassword = req.body.confirmPassword

    const existingUser = await Register.findOne({ email })

    if (existingUser) {
      // res.json('Email already exist in Database')
      req.flash('message', 'Email already exist in Database')
      res.redirect('/register')
    } else if (password.length <= 7) {
      req.flash('message', 'Password must have at least 8 characters')
      res.redirect('/register')
    } else {
      if (password === cpassword) {
        const newUser = new Register({
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: password,
          confirmPassword: cpassword,
        })

        await newUser.save().then((user) => {
          // sendVerificationEmail(result, res)

          const token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex'),
          })
          token.save().then((err) => {
            if (err) {
              console.log(err)
            }

            const mailOptions = {
              to: user.email,
              from: process.env.USER_AUTH_FOR_MAILER,
              subject: 'Acc Verification Token',
              html: `Please Verify Your Account by clicking this <a href="http://${req.headers.host}/confirmation/${token.token}">link</a>`,
            }

            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                console.log('failed')
              }
              res.render('pleaseCheck')
            })
          }) // end token of save
        }) // end of user save

        // await newUser.save()
        // res.redirect("/login");
      } else {
        // res.json('password are not match')
        req.flash('message', 'Password are not match')
        res.redirect('/register')
      }
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

const pConfirmation = (req, res) => {
  res.render('verified')
}

const pLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const useremail = await Register.findOne({ email: email })

    if (useremail.password === password) {
      res.redirect('/home')
    } else {
      req.flash('message', 'Email or Password is Incorrect')
      res.redirect('/login')
    }
  } catch (err) {
    req.flash('message', 'Account Not Found, Please Register First')
    res.redirect('/login')
  }
}

const usingMiddleware = async (req, res, next) => {
  latestUser = await Register.findOne().sort({ createdAt: -1 }).limit(1)
  const userID = latestUser._id

  Register.findById(userID)
    .then((userInDb) => {
      req.user = userInDb
      next()
    })
    .catch((err) => console.log(err))
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

const pDeleteItemCart = (req, res, next) => {
  req.user
    .removeCart(req.body.id)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

const gProduct = (req, res) => {
  res.render('products', { pageTitle: 'Products' })
}

const gOurTeam = (req, res) => {
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

      const added = await newProd.save()
      const added2 = await newProd2.save()
      res.redirect('/products#prods-area')
    } else {
      res.redirect('/products#prods-area')
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

const gFaq = (req, res) => {
  res.render('faq', { pageTitle: 'FAQ' })
}

const gTermsnConditions = (req, res) => {
  res.render('terms_and_conditions', { pageTitle: 'Terms and Condition' })
}

const gPrivacyPolicy = (req, res) => {
  res.render('privacy_policy', { pageTitle: 'Privacy Policy' })
}

const gAboutUs = (req, res) => {
  res.render('about_us', { pageTitle: 'About Us' })
}

const gHome = (req, res) => {
  Product.find().then((products) => {
    res.render('main_homepage', {
      prods: products,
      pageTitle: 'Welcome to EA',
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
    })
  })
}

const gProfile = (req, res) => {
  const user = req.user
  res.render('profile', { pageTitle: 'Profile', user })
}

const pLogout = (req, res) => {
  res.redirect('/')
}
const pPayment = async (req, res) => {
  const customer_creation = await stripe.customers
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
  pConfirmation,
  pContactUsForm,
  gSearchItem,
  gProfile,
  pLogout,
  pPayment,
}

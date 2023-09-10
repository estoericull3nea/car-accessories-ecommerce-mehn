require('dotenv').config()

const nodemailer = require('nodemailer')

const UserModel = require('../models/user')
const MessageModel = require('../models/Message')

let transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST,
  auth: {
    user: process.env.USER_AUTH_FOR_MAILER,
    pass: process.env.PASS_AUTH_FOR_MAILER,
  },
})

transporter.verify((err) => {
  if (err) {
    console.log(err)
  }
})

// getting
const getHomepage = async (req, res) => {
  const token = req.cookies['access_token'] // check token if generated
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('homepage', {
      pageTitle: 'EA',
      token,
      cartCount,
    })
  } else {
    res.render('homepage', {
      pageTitle: 'EA',
      token,
      cartCount: 0,
    })
  }
}

const getOurTeam = async (req, res) => {
  const token = req.cookies['access_token']

  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('team', { pageTitle: 'Our Team', token, cartCount })
  } else {
    res.render('team', { pageTitle: 'Our Team', token, cartCount: 0 })
  }
}

const getFAQ = async (req, res) => {
  const token = req.cookies['access_token']
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('faq', { pageTitle: 'FAQ', token, cartCount })
  } else {
    res.render('faq', { pageTitle: 'FAQ', token, cartCount: 0 })
  }
}

const getTermsAndConditions = async (req, res) => {
  const token = req.cookies['access_token']
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('terms', { pageTitle: 'Terms and Conditions', token, cartCount })
  } else {
    res.render('terms', {
      pageTitle: 'Terms and Conditions',
      token,
      cartCount: 0,
    })
  }
}

const getPrivacyPolicy = async (req, res) => {
  const token = req.cookies['access_token']
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('privacy', { pageTitle: 'Privacy Policy', token, cartCount })
  } else {
    res.render('privacy', { pageTitle: 'Privacy Policy', token, cartCount: 0 })
  }
}

const getAboutUs = async (req, res) => {
  const token = req.cookies['access_token']
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('about', { pageTitle: 'About Us', token, cartCount })
  } else {
    res.render('about', { pageTitle: 'About Us', token, cartCount: 0 })
  }
}
// end of getting

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

module.exports = {
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
  postContactUsForm,
}

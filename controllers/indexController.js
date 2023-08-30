require('dotenv').config()

const UserMessage = require('../models/Message')
const nodemailer = require('nodemailer')

const UserModel = require('../models/User')

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

  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length

  res.render('homepage', {
    pageTitle: 'EA',
    token,
    cartCount,
  })
}

const getOurTeam = async (req, res) => {
  const token = req.cookies['access_token']
  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length
  res.render('team', { pageTitle: 'Our Team', token, cartCount })
}

const getFAQ = async (req, res) => {
  const token = req.cookies['access_token']
  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length
  res.render('faq', { pageTitle: 'FAQ', token, cartCount })
}

const getTermsAndConditions = async (req, res) => {
  const token = req.cookies['access_token']
  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length
  res.render('terms', { pageTitle: 'Terms and Conditions', token, cartCount })
}

const getPrivacyPolicy = async (req, res) => {
  const token = req.cookies['access_token']
  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length
  res.render('privacy', { pageTitle: 'Privacy Policy', token, cartCount })
}

const getAboutUs = async (req, res) => {
  const token = req.cookies['access_token']
  const user = await UserModel.findById({ _id: req.session.user._id })
  const cartCount = user.cart.items.length
  res.render('about', { pageTitle: 'About Us', token, cartCount })
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

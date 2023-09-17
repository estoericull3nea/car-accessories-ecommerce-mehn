require('dotenv').config()

const nodemailer = require('nodemailer')

const UserModel = require('../models/user')

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
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('homepage', {
      pageTitle: 'EA',
      cartCount,
      user,
    })
  } else {
    res.render('homepage', {
      pageTitle: 'EA',
      cartCount: 0,
      user: null,
    })
  }
}

const getOurTeam = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('team', { pageTitle: 'Our Team', cartCount, user })
  } else {
    res.render('team', { pageTitle: 'Our Team', cartCount: 0, user: null })
  }
}

const getFAQ = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('faq', { pageTitle: 'FAQ', cartCount, user })
  } else {
    res.render('faq', { pageTitle: 'FAQ', cartCount: 0, user: null })
  }
}

const getTermsAndConditions = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('terms', { pageTitle: 'Terms and Conditions', cartCount, user })
  } else {
    res.render('terms', {
      pageTitle: 'Terms and Conditions',
      cartCount: 0,
      user: null,
    })
  }
}

const getPrivacyPolicy = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('privacy', { pageTitle: 'Privacy Policy', cartCount, user })
  } else {
    res.render('privacy', {
      pageTitle: 'Privacy Policy',
      cartCount: 0,
      user: null,
    })
  }
}

const getAboutUs = async (req, res) => {
  if (req.user) {
    const user = await UserModel.findById({ _id: req.user._id })
    const cartCount = user.cart.items.length

    res.render('about', { pageTitle: 'About Us', cartCount, user })
  } else {
    res.render('about', { pageTitle: 'About Us', cartCount: 0, user: null })
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

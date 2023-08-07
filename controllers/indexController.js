require('dotenv').config()

const UserMessage = require('../models/message')
const nodemailer = require('nodemailer')

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

const getHomepage = (_, res) => {
  Product.find().then((products) => {
    res.render('homepage', {
      prods: products,
      pageTitle: 'EA',
    })
  })
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

const getProfile = (req, res) => {
  const user = req.user
  res.render('profile', { pageTitle: 'Profile', user })
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

module.exports = {
  getOurTeam,
  getFAQ,
  getTermsAndConditions,
  getPrivacyPolicy,
  getAboutUs,
  getHomepage,
  postContactUsForm,
  getProfile,
}

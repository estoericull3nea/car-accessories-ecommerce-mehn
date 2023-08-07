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
  res.render('homepage', {
    pageTitle: 'EA',
  })
}

const getOurTeam = (_, res) => {
  res.render('team', { pageTitle: 'Our Team' })
}

const getFAQ = (_, res) => {
  res.render('faq', { pageTitle: 'FAQ' })
}

const getTermsAndConditions = (_, res) => {
  res.render('terms', { pageTitle: 'Terms and Conditions' })
}

const getPrivacyPolicy = (_, res) => {
  res.render('privacy', { pageTitle: 'Privacy Policy' })
}

const getAboutUs = (_, res) => {
  res.render('about', { pageTitle: 'About Us' })
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
}

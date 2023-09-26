require('dotenv').config()
const MessageModel = require('../models/Message')
const nodemailer = require('nodemailer')

const postMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body

    let transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      auth: {
        user: process.env.USER_AUTH_FOR_MAILER,
        pass: process.env.PASS_AUTH_FOR_MAILER,
      },
    })

    const newMessage = new MessageModel({
      name,
      email,
      message,
    })

    await newMessage.save()
    const mailOptions = {
      to: process.env.MY_EMAIL,
      from: newMessage.email,
      subject: 'User Queries!',
      text: `From ${newMessage.email}\nName: ${newMessage.name}\nMessage/Query: ${message}`,
    }
    await transporter.sendMail(mailOptions)
    res.redirect('/user/profile')
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = postMessage
